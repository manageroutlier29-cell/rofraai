import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/*
 * IntaSend sends different webhook payloads for:
 *
 * 1. Payment collection / checkout
 *    - api_ref
 *    - state
 *
 * 2. Send Money / payouts
 *    - tracking_id
 *    - transactions[]
 *
 * This webhook handles both flows.
 */

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const webhookChallenge =
  process.env.INTASEND_WEBHOOK_CHALLENGE;

if (!webhookChallenge) {
  console.error(
    "IntaSend webhook challenge is not configured."
  );

  return NextResponse.json(
    {
      error:
        "Webhook security configuration is missing.",
    },
    { status: 500 }
  );
}

if (
  typeof payload?.challenge !== "string" ||
  payload.challenge !== webhookChallenge
) {
  console.warn(
    "Rejected IntaSend webhook: invalid challenge."
  );

  return NextResponse.json(
    {
      error: "Invalid webhook challenge.",
    },
    { status: 401 }
  );
}

    console.log(
      "IntaSend webhook received:",
      JSON.stringify(payload, null, 2)
    );

    /*
     * ============================================================
     * PAYMENT COLLECTION / MARKETPLACE ACCESS UNLOCK
     * ============================================================
     *
     * Our unlock checkout creates:
     *
     * ACCESS_UNLOCK_<workerId>_<uuid>
     *
     * and sends it to IntaSend as api_ref.
     */
    const apiRef =
      typeof payload?.api_ref === "string"
        ? payload.api_ref
        : typeof payload?.apiRef === "string"
          ? payload.apiRef
          : null;

    if (
      apiRef &&
      apiRef.startsWith("ACCESS_UNLOCK_")
    ) {
      const paymentState =
        typeof payload?.state === "string"
          ? payload.state.toUpperCase()
          : null;

      console.log(
        "IntaSend access unlock webhook:",
        {
          apiRef,
          paymentState,
        }
      );

      /*
       * Find the internal transaction using our own
       * unique reference.
       */
      const unlockTransaction =
        await prisma.transaction.findFirst({
          where: {
            reference: apiRef,
            type: "ACCESS_UNLOCK",
          },
        });

      if (!unlockTransaction) {
        console.warn(
          "IntaSend access unlock transaction not found:",
          apiRef
        );

        /*
         * Return 200 so IntaSend does not repeatedly retry
         * an event for an unknown internal reference.
         */
        return NextResponse.json({
          received: true,
          message:
            "Access unlock transaction not found.",
        });
      }

      /*
       * Idempotency:
       *
       * Once the transaction has been finalized,
       * never unlock the worker again.
       */
      if (
        unlockTransaction.status === "COMPLETED" ||
        unlockTransaction.status === "FAILED"
      ) {
        return NextResponse.json({
          received: true,
          transactionId: unlockTransaction.id,
          apiRef,
          status: unlockTransaction.status,
          message:
            "Access unlock transaction already finalized.",
        });
      }

      /*
       * SUCCESS
       *
       * IntaSend payment collection completion is represented
       * by COMPLETE.
       */
      if (
        paymentState === "COMPLETE" ||
        paymentState === "COMPLETED" ||
        paymentState === "SUCCESSFUL"
      ) {
        await prisma.$transaction(async (tx) => {
          /*
           * Re-read inside the transaction to protect against
           * duplicate webhook delivery.
           */
          const current =
            await tx.transaction.findUnique({
              where: {
                id: unlockTransaction.id,
              },
            });

          if (!current) {
            throw new Error(
              "ACCESS_UNLOCK_TRANSACTION_NOT_FOUND"
            );
          }

          if (
            current.status === "COMPLETED" ||
            current.status === "FAILED"
          ) {
            return;
          }

          /*
           * The transaction reference is generated internally
           * as ACCESS_UNLOCK_<workerId>_<uuid>.
           *
           * We already know the worker from the transaction's
           * userId, so we do NOT trust worker information from
           * the webhook payload.
           */
          const workerId = current.userId;

          if (!workerId) {
            throw new Error(
              "ACCESS_UNLOCK_WORKER_NOT_FOUND"
            );
          }

          const access =
            await tx.workerAccess.findUnique({
              where: {
                workerId,
              },
            });

          if (!access) {
            throw new Error(
              "WORKER_ACCESS_NOT_FOUND"
            );
          }

          /*
           * Unlock marketplace access and finalize the
           * internal financial transaction atomically.
           */
          await tx.workerAccess.update({
            where: {
              workerId,
            },
            data: {
              isUnlocked: true,
              unlockedAt: new Date(),
              unlockTransactionId: current.id,
            },
          });

          await tx.transaction.update({
            where: {
              id: current.id,
            },
            data: {
              status: "COMPLETED",
              metadata: {
                ...(typeof current.metadata === "object" &&
                current.metadata !== null
                  ? current.metadata
                  : {}),
                workerId,
                provider: "INTASEND",
                status: "COMPLETED",
                apiRef,
                providerState: paymentState,
                invoiceId:
                  typeof payload?.invoice_id ===
                  "string"
                    ? payload.invoice_id
                    : null,
                trackingId:
                  typeof payload?.tracking_id ===
                  "string"
                    ? payload.tracking_id
                    : null,
                completedAt:
                  new Date().toISOString(),
              },
            },
          });
        });

        console.log(
          "IntaSend marketplace access unlocked:",
          {
            transactionId:
              unlockTransaction.id,
            apiRef,
            workerId:
              unlockTransaction.userId,
          }
        );

        return NextResponse.json({
          received: true,
          transactionId: unlockTransaction.id,
          apiRef,
          status: "COMPLETED",
          accessUnlocked: true,
        });
      }

      /*
       * FAILURE
       *
       * Do not unlock the worker.
       */
      const failedStates = [
        "FAILED",
        "CANCELLED",
        "CANCELED",
        "DECLINED",
        "REJECTED",
        "UNSUCCESSFUL",
      ];

      if (
        paymentState &&
        failedStates.includes(paymentState)
      ) {
        await prisma.transaction.updateMany({
          where: {
            id: unlockTransaction.id,
            status: "PENDING",
          },
          data: {
            status: "FAILED",
            metadata: {
              ...(typeof unlockTransaction.metadata ===
                "object" &&
              unlockTransaction.metadata !== null
                ? unlockTransaction.metadata
                : {}),
              provider: "INTASEND",
              status: "FAILED",
              apiRef,
              providerState: paymentState,
              failureReason:
                typeof payload?.message === "string"
                  ? payload.message
                  : "IntaSend payment failed.",
            },
          },
        });

        console.log(
          "IntaSend marketplace unlock payment failed:",
          {
            transactionId:
              unlockTransaction.id,
            apiRef,
            paymentState,
          }
        );

        return NextResponse.json({
          received: true,
          transactionId: unlockTransaction.id,
          apiRef,
          status: "FAILED",
          accessUnlocked: false,
        });
      }

      /*
       * PENDING / PROCESSING / UNKNOWN INTERMEDIATE STATE
       *
       * Do not modify access or balances.
       */
      console.log(
        "IntaSend marketplace unlock still processing:",
        {
          transactionId:
            unlockTransaction.id,
          apiRef,
          paymentState,
        }
      );

      return NextResponse.json({
        received: true,
        transactionId: unlockTransaction.id,
        apiRef,
        status: "PROCESSING",
        providerState: paymentState,
        accessUnlocked: false,
      });
    }

    /*
     * ============================================================
     * SEND MONEY / WITHDRAWAL
     * ============================================================
     *
     * Existing withdrawal processing remains below.
     */
    const trackingId =
      typeof payload?.tracking_id === "string"
        ? payload.tracking_id
        : typeof payload?.trackingId === "string"
          ? payload.trackingId
          : null;

    if (!trackingId) {
      return NextResponse.json({
        received: true,
        message:
          "Webhook received without tracking ID or access unlock api_ref.",
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
      typeof transaction.status_description ===
      "string"
        ? transaction.status_description
        : null;

    /*
     * SUCCESS
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
     * Intermediate withdrawal states.
     *
     * Do not touch wallet balances.
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
