import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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
        { error: "Only workers can access projects." },
        { status: 403 }
      );
    }

    const workerId = session.user.id;
    const { id: projectId } = await context.params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        status: "OPEN",
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            clientProfile: {
              select: {
                companyName: true,
              },
            },
          },
        },
        tasks: {
          where: {
            status: "AVAILABLE",
          },
          include: {
            assignments: {
              where: {
                workerId,
              },
              select: {
                id: true,
                status: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or is no longer available." },
        { status: 404 }
      );
    }

    const availableTasks = project.tasks.filter(
      (task) => task.assignments.length === 0
    );

    const rewards = availableTasks.map((task) =>
      Number(task.reward)
    );

    const minimumReward =
      rewards.length > 0 ? Math.min(...rewards) : 0;

    const maximumReward =
      rewards.length > 0 ? Math.max(...rewards) : 0;

    const companyName =
      project.client.clientProfile?.companyName ||
      `${project.client.firstName} ${project.client.lastName}`;

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        budget: project.budget.toString(),
        status: project.status,
        deadline: project.deadline,

        client: {
          id: project.client.id,
          name: companyName,
        },

        tasks: {
          total: project.tasks.length,
          available: availableTasks.length,
        },

        pay: {
          minimum: minimumReward.toFixed(2),
          maximum: maximumReward.toFixed(2),
          currency: "USD",
        },

        taskList: availableTasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          category: task.category,
          reward: task.reward.toString(),
          deadline: task.deadline,
        })),
      },
    });
  } catch (error) {
    console.error("Worker project details error:", error);

    return NextResponse.json(
      { error: "Unable to load project." },
      { status: 500 }
    );
  }
}
