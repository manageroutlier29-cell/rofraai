import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    console.log(
      "IntaSend webhook received:",
      JSON.stringify(payload, null, 2)
    );

    const trackingId =
      typeof payload?.tracking_id === "string"
        ? payload.tracking_id
        : typeof payload?.trackingId === "string"
          ? payload.trackingId
          : null;

    if (!trackingId) {
      return NextResponse.json({
        received: true,
        message: "Webhook received without tracking ID.",
      });
    }

    const withdrawal =
      await prisma.withdrawal.findFirst({
        where: {
          paymentReference: trackingId,
        },
      });

    if (!withdrawal) {
      console.warn(
        "IntaSend webhook: withdrawal not found",
        trackingId
      );

      return NextResponse.json({
        received: true,
        message: "Withdrawal not found.",
      });
    }

    /*
     * Idempotency:
     *
     * IntaSend can send status updates/retries.
     * Never process a finalized withdrawal again.
     */
    if (
      withdrawal.status === "PAID" ||
      withdrawal.status === "FAILED" ||
      withdrawal.status === "CANCELLED"
    ) {
      return NextResponse.json({
        received: true,
        message: "Withdrawal already finalized.",
      });
    }

    /*
     * IntaSend sends individual transaction results
     * inside the transactions array.
     */
    const transaction =
      Array.isArray(payload?.transactions)
        ? payload.transactions[0]
        : null;

    if (!transaction) {
      console.warn(
        "IntaSend webhook: no transaction details",
        trackingId
      );

      return NextResponse.json({
        received: true,
        message:
          "Webhook received but no transaction details were provided.",
      });
    }

    const transactionStatus =
      typeof transaction.status === "string"
        ? transaction.status
        : null;

    const statusCode =
      typeof transaction.status_code === "string"
        ? transaction.status_code
        : null;

    const statusDescription =
      typeof transaction.status_description === "string"
        ? transaction.status_description
        : null;

    /*
     * SUCCESS
     *
     * IntaSend's send-money events use "Successful"
     * for a successful individual transaction.
     */
    if (
      transactionStatus?.toLowerCase() ===
      "successful"
    ) {
      await prisma.$transaction(async (tx) => {
        const current =
          await tx.withdrawal.findUnique({
            where: {
              id: withdrawal.id,
            },
          });

        if (!current) {
          return;
        }

        /*
         * Protect against duplicate webhook delivery.
         */
        if (
          current.status === "PAID" ||
          current.status === "FAILED" ||
          current.status === "CANCELLED"
        ) {
          return;
        }

        const wallet =
          await tx.workerWallet.findUnique({
            where: {
              workerId: current.workerId,
            },
          });

        if (!wallet) {
          throw new Error(
            "Worker wallet not found."
          );
        }

        /*
         * Move the withdrawn USD amount from
         * pending balance to paid balance.
         */
        await tx.workerWallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            pendingBalance: {
              decrement: Number(current.amount),
            },
            paidBalance: {
              increment: Number(current.amount),
            },
          },
        });

        /*
         * Store the provider's final reference.
         */
        const providerReference =
          typeof transaction.provider_reference ===
          "string"
            ? transaction.provider_reference
            : null;

        await tx.withdrawal.update({
          where: {
            id: current.id,
          },
          data: {
            status: "PAID",

            paymentReference:
              providerReference ||
              current.paymentReference,

            processedAt: new Date(),

            failureReason: null,
          },
        });

        /*
         * Finalize the corresponding transaction.
         */
        await tx.transaction.updateMany({
          where: {
            reference: current.id,
            type: "WITHDRAWAL",
          },
          data: {
            status: "COMPLETED",

            metadata: {
              withdrawalId: current.id,
              paymentMethod:
                current.paymentMethod,
              provider: "INTASEND",
              trackingId,
              providerReference,
              transactionId:
                transaction.transaction_id ??
                null,
              status: transactionStatus,
              statusCode,
            },
          },
        });
      });

      console.log(
        "IntaSend withdrawal marked PAID:",
        withdrawal.id
      );

      return NextResponse.json({
        received: true,
        withdrawalId: withdrawal.id,
        trackingId,
        status: "PAID",
      });
    }

    /*
     * FAILURE
     *
     * Return the reserved USD amount from pending
     * back to available balance.
     */
    const failedStatuses = [
      "failed",
      "unsuccessful",
      "payerror",
    ];

    if (
      transactionStatus &&
      failedStatuses.includes(
        transactionStatus.toLowerCase()
      )
    ) {
      await prisma.$transaction(async (tx) => {
        const current =
          await tx.withdrawal.findUnique({
            where: {
              id: withdrawal.id,
            },
          });

        if (!current) {
          return;
        }

        if (
          current.status === "PAID" ||
          current.status === "FAILED" ||
          current.status === "CANCELLED"
        ) {
          return;
        }

        const wallet =
          await tx.workerWallet.findUnique({
            where: {
              workerId: current.workerId,
            },
          });

        if (!wallet) {
          throw new Error(
            "Worker wallet not found."
          );
        }

        /*
         * Return the reserved USD amount.
         */
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

        await tx.withdrawal.update({
          where: {
            id: current.id,
          },
          data: {
            status: "FAILED",

            failureReason:
              statusDescription ||
              "M-Pesa payout failed.",

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
              trackingId,
              transactionId:
                transaction.transaction_id ??
                null,
              status: transactionStatus,
              statusCode,
              failureReason:
                statusDescription ||
                "M-Pesa payout failed.",
            },
          },
        });
      });

      console.log(
        "IntaSend withdrawal marked FAILED:",
        withdrawal.id
      );

      return NextResponse.json({
        received: true,
        withdrawalId: withdrawal.id,
        trackingId,
        status: "FAILED",
      });
    }

    /*
     * Intermediate states:
     *
     * Do not touch wallet balances.
     * The withdrawal remains PROCESSING.
     */
    console.log(
      "IntaSend withdrawal still processing:",
      {
        withdrawalId: withdrawal.id,
        trackingId,
        transactionStatus,
        statusCode,
      }
    );

    return NextResponse.json({
      received: true,
      withdrawalId: withdrawal.id,
      trackingId,
      status: "PROCESSING",
      providerStatus: transactionStatus,
    });
  } catch (error) {
    console.error(
      "IntaSend webhook error:",
      error
    );

    return NextResponse.json(
      {
        error: "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}