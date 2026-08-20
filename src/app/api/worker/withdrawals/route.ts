import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateKesPayout } from "@/lib/payout-config";

const MIN_WITHDRAWAL = 10;

export async function GET() {
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
        { error: "Only workers can access withdrawals." },
        { status: 403 }
      );
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        workerId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      withdrawals: withdrawals.map((withdrawal) => ({
        id: withdrawal.id,
        amount: withdrawal.amount.toString(),
        status: withdrawal.status,
        paymentMethod: withdrawal.paymentMethod,
        paymentReference: withdrawal.paymentReference,
        failureReason: withdrawal.failureReason,

         payoutAmount:
    withdrawal.payoutAmount?.toString() ?? null,

  payoutCurrency:
    withdrawal.payoutCurrency,

  exchangeRate:
    withdrawal.exchangeRate?.toString() ?? null,

        requestedAt: withdrawal.requestedAt,
        processedAt: withdrawal.processedAt,
        createdAt: withdrawal.createdAt,
      })),
    });
  } catch (error) {
    console.error("Worker withdrawals error:", error);

    return NextResponse.json(
      { error: "Unable to load withdrawals." },
      { status: 500 }
    );
  }
}

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
        { error: "Only workers can request withdrawals." },
        { status: 403 }
      );
    }

    const body = await request.json();

   const amount = Number(body.amount);

if (!Number.isFinite(amount) || amount <= 0) {
  return NextResponse.json(
    { error: "Enter a valid withdrawal amount." },
    { status: 400 }
  );
}

if (amount < MIN_WITHDRAWAL) {
  return NextResponse.json(
    {
      error: `Minimum withdrawal amount is $${MIN_WITHDRAWAL.toFixed(2)}.`,
    },
    { status: 400 }
  );
}

const paymentAccountId =
  typeof body.paymentAccountId === "string"
    ? body.paymentAccountId.trim()
    : "";

if (!paymentAccountId) {
  return NextResponse.json(
    { error: "Please select a payment account." },
    { status: 400 }
  );
}

/*
 * Calculate the payout using the single payout
 * configuration source of truth.
 *
 * The exchange rate and KES amount are then
 * snapshotted onto the withdrawal.
 */
let payout;

try {
  payout = calculateKesPayout(amount);
} catch (error) {
  console.error("Payout calculation error:", error);

  return NextResponse.json(
    {
      error:
        "Withdrawal exchange rate is not configured.",
    },
    { status: 500 }
  );
}

    const workerId = session.user.id;


    const result = await prisma.$transaction(async (tx) => {
      /*
       * Verify that the payment account belongs to this worker.
       *
       * Never trust a paymentAccountId supplied by the browser.
       */
      const paymentAccount =
        await tx.paymentAccount.findFirst({
          where: {
            id: paymentAccountId,
            workerId,
            status: "ACTIVE",
          },
        });

      if (!paymentAccount) {
        throw new Error("INVALID_PAYMENT_ACCOUNT");
      }

      /*
       * Get or create the worker wallet.
       */
      const wallet = await tx.workerWallet.upsert({
        where: {
          workerId,
        },
        create: {
          workerId,
          availableBalance: 0,
          pendingBalance: 0,
          paidBalance: 0,
        },
        update: {},
      });

      const availableBalance = Number(
        wallet.availableBalance
      );

      /*
       * Wallet available balance is the source of truth.
       */
      if (amount > availableBalance) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      /*
       * Reserve the money immediately.
       *
       * Available decreases.
       * Pending increases.
       */
      const updatedWallet =
        await tx.workerWallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            availableBalance: {
              decrement: amount,
            },
            pendingBalance: {
              increment: amount,
            },
          },
        });

      /*
       * Create the withdrawal.
       *
       * Store a snapshot of the payout account so that
       * future edits to the worker's payment account do
       * not change the historical withdrawal record.
       */
      const withdrawal =
        await tx.withdrawal.create({
          data: {
            workerId,
            amount,
            status: "PENDING",


            paymentMethod:
              paymentAccount.type === "MPESA"
                ? "M-Pesa"
                : "Bank Transfer",

            paymentAccountId:
              paymentAccount.id,

            payoutAccountName:
              paymentAccount.accountName,

            payoutPhoneNumber:
              paymentAccount.phoneNumber,

            payoutBankName:
              paymentAccount.bankName,

            payoutAccountNumber:
              paymentAccount.accountNumber,

            payoutBankCode:
              paymentAccount.bankCode,

            payoutCountry:
              paymentAccount.country,

            payoutCurrencyCode:
              paymentAccount.currency,
            exchangeRate: payout.exchangeRate,
payoutAmount: payout.payoutAmount,
payoutCurrency: payout.payoutCurrency,

            requestedAt: new Date(),
          },
        });

      /*
       * Create the corresponding transaction.
       */
      const transaction =
        await tx.transaction.create({
          data: {
            userId: workerId,
            type: "WITHDRAWAL",
            status: "PENDING",
            amount,
            currency: "USD",
            reference: withdrawal.id,
            description:
              `Withdrawal request via ${
                paymentAccount.type === "MPESA"
                  ? "M-Pesa"
                  : "Bank Transfer"
              }`,
            metadata: {
              withdrawalId: withdrawal.id,
              paymentAccountId: paymentAccount.id,
              paymentAccountType: paymentAccount.type,
              payoutCurrency: payout.payoutCurrency,
  payoutCurrencyCode: payout.payoutCurrencyCode,
  exchangeRate: payout.exchangeRate,
  payoutAmount: payout.payoutAmount,
            },
          },
        });

      return {
        withdrawal,
        wallet: updatedWallet,
        transaction,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Withdrawal request submitted successfully.",

        withdrawal: {
  id: result.withdrawal.id,
  amount:
    result.withdrawal.amount.toString(),
  status: result.withdrawal.status,
  paymentMethod:
    result.withdrawal.paymentMethod,
  paymentAccountId:
    result.withdrawal.paymentAccountId,
  payoutAmount:
    result.withdrawal.payoutAmount?.toString() ?? null,
  payoutCurrency:
    result.withdrawal.payoutCurrency,
  exchangeRate:
    result.withdrawal.exchangeRate?.toString() ?? null,
  requestedAt:
    result.withdrawal.requestedAt,
},

        balance: {
          available:
            result.wallet.availableBalance.toString(),
          pending:
            result.wallet.pendingBalance.toString(),
          paidOut:
            result.wallet.paidBalance.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_PAYMENT_ACCOUNT"
    ) {
      return NextResponse.json(
        {
          error:
            "The selected payment account is invalid or unavailable.",
        },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "INSUFFICIENT_BALANCE"
    ) {
      return NextResponse.json(
        {
          error:
            "Insufficient available balance for this withdrawal.",
        },
        { status: 400 }
      );
    }

    console.error(
      "Create withdrawal error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create withdrawal request.",
      },
      { status: 500 }
    );
  }
}
