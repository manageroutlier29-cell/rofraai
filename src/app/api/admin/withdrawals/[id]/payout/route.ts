import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { initiateMpesaPayout } from "@/lib/intasend-payouts";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id },
      include: {
        worker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        paymentAccount: true,
      },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal not found." },
        { status: 404 }
      );
    }

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json(
        {
          error:
            "Only pending withdrawals can be sent for payout.",
        },
        { status: 409 }
      );
    }

    if (!withdrawal.paymentAccount) {
      return NextResponse.json(
        {
          error:
            "No payment account is associated with this withdrawal.",
        },
        { status: 409 }
      );
    }

    if (withdrawal.paymentAccount.type !== "MPESA") {
      return NextResponse.json(
        {
          error:
            "Automatic payout currently supports M-Pesa only.",
        },
        { status: 400 }
      );
    }

    const phoneNumber =
      withdrawal.payoutPhoneNumber ||
      withdrawal.paymentAccount.phoneNumber;

    if (!phoneNumber) {
      return NextResponse.json(
        {
          error:
            "No M-Pesa phone number is available for this withdrawal.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate the KES payout amount BEFORE changing
     * the withdrawal from PENDING to PROCESSING.
     */
    if (!withdrawal.payoutAmount) {
      return NextResponse.json(
        {
          error:
            "KES payout amount has not been calculated for this withdrawal.",
        },
        { status: 409 }
      );
    }

    const amountKES = Number(withdrawal.payoutAmount);

    if (!Number.isFinite(amountKES) || amountKES <= 0) {
      return NextResponse.json(
        {
          error:
            "The KES payout amount is invalid.",
        },
        { status: 409 }
      );
    }

    /*
     * Move the withdrawal to PROCESSING before
     * calling the external payment provider.
     *
     * The conditional update prevents two admins
     * from intentionally processing the same
     * withdrawal simultaneously.
     */
    const processingWithdrawal =
      await prisma.withdrawal.updateMany({
        where: {
          id,
          status: "PENDING",
        },
        data: {
          status: "PROCESSING",
        },
      });

    if (processingWithdrawal.count !== 1) {
      return NextResponse.json(
        {
          error:
            "This withdrawal is already being processed.",
        },
        { status: 409 }
      );
    }

    try {
      const origin = new URL(request.url).origin;

      const callbackUrl =
        `${origin}/api/webhooks/intasend`;

      const result = await initiateMpesaPayout({
        name:
          withdrawal.payoutAccountName ||
          `${withdrawal.worker.firstName} ${withdrawal.worker.lastName}`.trim() ||
          withdrawal.worker.email ||
          "ROFRAAI Worker",

        phoneNumber,

        amountKES,

        narrative:
          `ROFRAAI withdrawal ${withdrawal.id}`,

        callbackUrl,

        deviceId:
          process.env.INTASEND_DEVICE_ID ||
          undefined,

        requiresApproval: "NO",
      });

      /*
       * IntaSend accepting the request does NOT mean
       * the M-Pesa payment has completed.
       *
       * The webhook is responsible for marking the
       * withdrawal PAID or FAILED.
       */
      console.log(
        "IntaSend payout initiation response:",
        JSON.stringify(result, null, 2)
      );

      const trackingId =
        extractTrackingId(result);

      console.log(
        "Extracted IntaSend tracking ID:",
        trackingId
      );

      /*
       * A tracking ID is required because the webhook
       * uses it to locate this withdrawal.
       */
      if (!trackingId) {
        throw new Error(
          "IntaSend accepted the payout but did not return a tracking ID."
        );
      }

      await prisma.withdrawal.update({
        where: { id },
        data: {
          paymentReference: trackingId,
        },
      });

      return NextResponse.json({
        success: true,

        message:
          "M-Pesa payout initiated. Waiting for provider confirmation.",

        withdrawalId: withdrawal.id,

        status: "PROCESSING",

        trackingId,
      });
    } catch (error) {
      /*
       * If IntaSend rejects the initiation request,
       * release the reserved worker balance.
       */
      await prisma.$transaction(async (tx) => {
        const current =
          await tx.withdrawal.findUnique({
            where: { id },
          });

        if (
          !current ||
          current.status !== "PROCESSING"
        ) {
          return;
        }

        const wallet =
          await tx.workerWallet.findUnique({
            where: {
              workerId: current.workerId,
            },
          });

        if (wallet) {
          await tx.workerWallet.update({
            where: {
              id: wallet.id,
            },
            data: {
              pendingBalance: {
                decrement: Number(current.amount),
              },
              availableBalance: {
                increment: Number(current.amount),
              },
            },
          });
        }

        await tx.withdrawal.update({
          where: { id },

          data: {
            status: "FAILED",

            failureReason:
              error instanceof Error
                ? error.message
                : "IntaSend payout initiation failed.",

            processedAt: new Date(),
          },
        });

        await tx.transaction.updateMany({
          where: {
            reference: current.id,
            type: "WITHDRAWAL",
          },

          data: {
            status: "FAILED",

            metadata: {
              withdrawalId: current.id,

              paymentMethod:
                current.paymentMethod,

              provider: "INTASEND",

              failureReason:
                error instanceof Error
                  ? error.message
                  : "IntaSend payout initiation failed.",
            },
          },
        });
      });

      throw error;
    }
  } catch (error) {
    console.error(
      "IntaSend payout initiation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to initiate M-Pesa payout.",
      },
      { status: 500 }
    );
  }
}

/*
 * Extract ONLY the IntaSend tracking ID.
 *
 * This is intentionally narrower than the previous
 * extractProviderReference() function because the
 * webhook searches Withdrawal.paymentReference
 * using the tracking ID.
 */
function extractTrackingId(
  result: unknown
): string | null {
  if (!result || typeof result !== "object") {
    return null;
  }

  const data =
    result as Record<string, unknown>;

  if (
    typeof data.tracking_id === "string" &&
    data.tracking_id.trim()
  ) {
    return data.tracking_id.trim();
  }

  if (
    typeof data.trackingId === "string" &&
    data.trackingId.trim()
  ) {
    return data.trackingId.trim();
  }

  /*
   * Some responses may place the tracking ID
   * inside the transactions array.
   */
  if (Array.isArray(data.transactions)) {
    for (const transaction of data.transactions) {
      if (
        !transaction ||
        typeof transaction !== "object"
      ) {
        continue;
      }

      const tx =
        transaction as Record<string, unknown>;

      if (
        typeof tx.tracking_id === "string" &&
        tx.tracking_id.trim()
      ) {
        return tx.tracking_id.trim();
      }

      if (
        typeof tx.trackingId === "string" &&
        tx.trackingId.trim()
      ) {
        return tx.trackingId.trim();
      }
    }
  }

  return null;
}