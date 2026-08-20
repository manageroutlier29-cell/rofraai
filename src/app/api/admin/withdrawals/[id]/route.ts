import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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
    const body = await request.json();

    const status = body.status;

    const paymentReference =
      typeof body.paymentReference === "string"
        ? body.paymentReference.trim()
        : null;

    const failureReason =
      typeof body.failureReason === "string"
        ? body.failureReason.trim()
        : null;

    const allowedStatuses = [
      "PROCESSING",
      "FAILED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid withdrawal status." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({
        where: {
          id,
        },
      });

      if (!withdrawal) {
        throw new Error("WITHDRAWAL_NOT_FOUND");
      }

      /*
       * Final withdrawals cannot be changed again.
       */
      if (
        withdrawal.status === "PAID" ||
        withdrawal.status === "FAILED" ||
        withdrawal.status === "CANCELLED"
      ) {
        throw new Error("WITHDRAWAL_ALREADY_FINAL");
      }

      /*
       * Valid status transitions:
       *
       * PENDING → PROCESSING
       * PROCESSING → PAID
       * PENDING → FAILED
       * PROCESSING → FAILED
       * PENDING → CANCELLED
       * PROCESSING → CANCELLED
       */
      if (
        status === "PROCESSING" &&
        withdrawal.status !== "PENDING"
      ) {
        throw new Error("INVALID_PAYMENT_TRANSITION");
      }


      if (
        (status === "FAILED" || status === "CANCELLED") &&
        withdrawal.status !== "PENDING" &&
        withdrawal.status !== "PROCESSING"
      ) {
        throw new Error("INVALID_PAYMENT_TRANSITION");
      }

      /*
       * Get the worker wallet.
       */
      const wallet = await tx.workerWallet.findUnique({
        where: {
          workerId: withdrawal.workerId,
        },
      });

      if (!wallet) {
        throw new Error("WALLET_NOT_FOUND");
      }

      const withdrawalAmount = Number(withdrawal.amount);

      /*
       * PAID
       *
       * Move money:
       *
       * pendingBalance → paidBalance
       */
      if (status === "PAID") {
        const pendingBalance = Number(wallet.pendingBalance);

        if (pendingBalance < withdrawalAmount) {
          throw new Error("INSUFFICIENT_PENDING_BALANCE");
        }

        await tx.workerWallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            pendingBalance: {
              decrement: withdrawalAmount,
            },
            paidBalance: {
              increment: withdrawalAmount,
            },
          },
        });
      }

      /*
       * FAILED / CANCELLED
       *
       * Return money:
       *
       * pendingBalance → availableBalance
       */
      if (
        status === "FAILED" ||
        status === "CANCELLED"
      ) {
        const pendingBalance = Number(wallet.pendingBalance);

        if (pendingBalance < withdrawalAmount) {
          throw new Error("INSUFFICIENT_PENDING_BALANCE");
        }

        await tx.workerWallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            pendingBalance: {
              decrement: withdrawalAmount,
            },
            availableBalance: {
              increment: withdrawalAmount,
            },
          },
        });
      }

      /*
       * Update withdrawal record.
       */
      const updatedWithdrawal =
  await tx.withdrawal.update({
    where: {
      id,
    },
    data: {
      status,

      paymentReference:
        paymentReference ??
        withdrawal.paymentReference,

      failureReason:
        failureReason ??
        withdrawal.failureReason,

      processedAt:
        status === "PAID" ||
        status === "FAILED" ||
        status === "CANCELLED"
          ? new Date()
          : null,
    },
  });

/*
 * Update the financial transaction ledger.
 *
 * The worker withdrawal created a PENDING
 * transaction when the request was submitted.
 *
 * PROCESSING keeps the transaction pending.
 * Final states close the transaction.
 */
if (
  status === "PAID" ||
  status === "FAILED" ||
  status === "CANCELLED"
) {
  const transactionStatus =
    status === "PAID"
      ? "COMPLETED"
      : status;

  await tx.transaction.updateMany({
    where: {
      reference: withdrawal.id,
      type: "WITHDRAWAL",
    },
    data: {
      status: transactionStatus,
      metadata: {
        withdrawalId: withdrawal.id,
        paymentMethod: withdrawal.paymentMethod,
        paymentReference:
          paymentReference ??
          withdrawal.paymentReference,
        failureReason:
          failureReason ??
          withdrawal.failureReason,
      },
    },
  });
}

return updatedWithdrawal;
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal marked as ${status}.`,

      withdrawal: {
        id: result.id,
        amount: result.amount.toString(),
        status: result.status,
        paymentMethod: result.paymentMethod,
        paymentReference: result.paymentReference,
        failureReason: result.failureReason,
        requestedAt: result.requestedAt,
        processedAt: result.processedAt,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "WITHDRAWAL_NOT_FOUND":
          return NextResponse.json(
            { error: "Withdrawal not found." },
            { status: 404 }
          );

        case "WITHDRAWAL_ALREADY_FINAL":
          return NextResponse.json(
            {
              error:
                "This withdrawal has already been finalized.",
            },
            { status: 409 }
          );

        case "INVALID_PAYMENT_TRANSITION":
          return NextResponse.json(
            {
              error:
                "Invalid withdrawal status transition.",
            },
            { status: 409 }
          );

        case "WALLET_NOT_FOUND":
          return NextResponse.json(
            {
              error:
                "Worker wallet could not be found.",
            },
            { status: 409 }
          );

        case "INSUFFICIENT_PENDING_BALANCE":
          return NextResponse.json(
            {
              error:
                "The worker wallet does not have enough pending balance for this withdrawal.",
            },
            { status: 409 }
          );
      }
    }

        console.error("Admin withdrawal processing error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process withdrawal.",
      },
      { status: 500 }
    );
  }
}