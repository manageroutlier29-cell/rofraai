import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createIntaSendCheckout } from "@/lib/intasend-checkout";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    if (session.user.role !== "WORKER") {
      return NextResponse.json(
        { error: "Only workers can unlock marketplace access." },
        { status: 403 }
      );
    }

    const workerId = session.user.id;

    const worker = await prisma.user.findUnique({
      where: {
        id: workerId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
      },
    });

    if (!worker) {
      return NextResponse.json(
        { error: "Worker account not found." },
        { status: 404 }
      );
    }

    if (worker.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your worker account is not active." },
        { status: 403 }
      );
    }

    const access = await prisma.workerAccess.findUnique({
      where: {
        workerId,
      },
    });

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Your marketplace access record could not be found. Please contact support.",
        },
        { status: 500 }
      );
    }

    if (access.isUnlocked) {
      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        message: "Marketplace access is already unlocked.",
      });
    }

    /*
     * Read the public origin from the request.
     * The actual payment is still created server-side.
     */
    const requestUrl = new URL(request.url);
    const host = requestUrl.origin;

    /*
     * api_ref uniquely connects the IntaSend payment
     * to our internal financial transaction.
     */
    const apiRef = `ACCESS_UNLOCK_${workerId}_${crypto.randomUUID()}`;

    const amountKES = Number(access.unlockFee);

    if (!Number.isFinite(amountKES) || amountKES <= 0) {
      return NextResponse.json(
        { error: "The marketplace unlock fee is invalid." },
        { status: 500 }
      );
    }

    /*
     * Create the internal pending transaction first.
     *
     * The worker is NOT unlocked here.
     * Unlocking happens only after confirmed payment.
     */
    const transaction = await prisma.transaction.create({
      data: {
        userId: workerId,
        type: "ACCESS_UNLOCK",
        status: "PENDING",
        amount: amountKES,
        currency: "KES",
        reference: apiRef,
        description: "ROFRAAI marketplace access unlock",
        metadata: {
          workerId,
          unlockFee: amountKES,
          provider: "INTASEND",
          status: "PENDING",
        },
      },
    });

    try {
      const checkout = await createIntaSendCheckout({
        firstName: worker.firstName || "ROFRAAI",
        lastName: worker.lastName || "Worker",
        email: worker.email,
        amountKES,
        apiRef,
        host,
        redirectUrl: `${host}/worker/earnings?unlock=complete`,
      });

      const checkoutUrl =
        typeof checkout.url === "string"
          ? checkout.url
          : null;

      const invoiceId =
        typeof checkout.invoice_id === "string"
          ? checkout.invoice_id
          : null;

      if (!checkoutUrl) {
        await prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "FAILED",
            metadata: {
              workerId,
              unlockFee: amountKES,
              provider: "INTASEND",
              status: "FAILED",
              error: "IntaSend did not return a checkout URL.",
              response: JSON.parse(JSON.stringify(checkout)),
            },
          },
        });

        return NextResponse.json(
          {
            error:
              "Payment checkout could not be created.",
          },
          { status: 502 }
        );
      }

      await prisma.transaction.update({
        where: {
          id: transaction.id,
        },
        data: {
          metadata: {
            workerId,
            unlockFee: amountKES,
            provider: "INTASEND",
            status: "PENDING",
            invoiceId,
            checkoutUrl,
          },
        },
      });

      return NextResponse.json({
        success: true,
        alreadyUnlocked: false,
        transactionId: transaction.id,
        apiRef,
        invoiceId,
        checkoutUrl,
        amount: amountKES.toFixed(2),
        currency: "KES",
      });
    } catch (checkoutError) {
      await prisma.transaction.update({
        where: {
          id: transaction.id,
        },
        data: {
          status: "FAILED",
          metadata: {
            workerId,
            unlockFee: amountKES,
            provider: "INTASEND",
            status: "FAILED",
            error:
              checkoutError instanceof Error
                ? checkoutError.message
                : "Checkout creation failed.",
          },
        },
      });

      throw checkoutError;
    }
  } catch (error) {
    console.error(
      "Worker marketplace unlock error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create marketplace unlock payment.",
      },
      { status: 500 }
    );
  }
}
