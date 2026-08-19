import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "WORKER") {
      return NextResponse.json(
        {
          error: "Only workers can access earnings.",
        },
        { status: 403 }
      );
    }

    const workerId = session.user.id;

    const earnings = await prisma.earning.findMany({
      where: {
        workerId,
      },
      include: {
        assignment: {
          include: {
            task: {
              include: {
                project: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const wallet = await prisma.workerWallet.upsert({
  where: {
    workerId,
  },
  create: {
    workerId,
  },
  update: {},
});

const available = Number(wallet.availableBalance);
const pending = Number(wallet.pendingBalance);
const paid = Number(wallet.paidBalance);

const totalEarned = available + pending + paid;

    return NextResponse.json({
      success: true,

      balance: {
        available: available.toFixed(2),
        pending: pending.toFixed(2),
        paidOut: paid.toFixed(2),
        totalEarned: totalEarned.toFixed(2),
      },

      earnings: earnings.map((earning) => ({
        id: earning.id,
        amount: earning.amount.toString(),
        status: earning.status,
        description: earning.description,

        assignmentId: earning.assignmentId,

        task: {
          id: earning.assignment.task.id,
          title: earning.assignment.task.title,
          category: earning.assignment.task.category,
          reward: earning.assignment.task.reward.toString(),
        },

        project: {
          id: earning.assignment.task.project.id,
          title: earning.assignment.task.project.title,
        },

        availableAt: earning.availableAt,
        paidAt: earning.paidAt,
        reversedAt: earning.reversedAt,

        createdAt: earning.createdAt,
        updatedAt: earning.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Worker earnings error:", error);

    return NextResponse.json(
      {
        error: "Unable to load earnings.",
      },
      { status: 500 }
    );
  }
}
