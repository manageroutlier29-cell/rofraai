import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const withdrawals = await prisma.withdrawal.findMany({
      include: {
        worker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
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

  payoutAmount:
    withdrawal.payoutAmount?.toString() ?? null,

  payoutCurrency:
    withdrawal.payoutCurrency,

  exchangeRate:
    withdrawal.exchangeRate?.toString() ?? null,

  status: withdrawal.status,
  paymentMethod: withdrawal.paymentMethod,
  paymentReference: withdrawal.paymentReference,
  failureReason: withdrawal.failureReason,
  requestedAt: withdrawal.requestedAt,
  processedAt: withdrawal.processedAt,
  createdAt: withdrawal.createdAt,
  worker: withdrawal.worker,
})),
    });
  } catch (error) {
    console.error("Admin withdrawals error:", error);

    return NextResponse.json(
      { error: "Unable to load withdrawals." },
      { status: 500 }
    );
  }
}
