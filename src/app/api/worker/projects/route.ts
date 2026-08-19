import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
        { error: "Only workers can access projects." },
        { status: 403 }
      );
    }

    const workerId = session.user.id;

    const projects = await prisma.project.findMany({
      where: {
        status: "OPEN",
        tasks: {
          some: {
            status: "AVAILABLE",
          },
        },
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

      orderBy: {
        createdAt: "desc",
      },
    });

    const result = projects.map((project) => {
      const availableTasks = project.tasks.filter(
        (task) => task.assignments.length === 0
      );

      const totalTasks = project.tasks.length;

      const taskRewards = project.tasks.map((task) =>
        Number(task.reward)
      );

      const highestReward =
        taskRewards.length > 0
          ? Math.max(...taskRewards)
          : 0;

      const lowestReward =
        taskRewards.length > 0
          ? Math.min(...taskRewards)
          : 0;

      const companyName =
        project.client.clientProfile?.companyName ||
        `${project.client.firstName} ${project.client.lastName}`;

      return {
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
          total: totalTasks,
          available: availableTasks.length,
        },

        pay: {
          minimum: lowestReward.toFixed(2),
          maximum: highestReward.toFixed(2),
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
      };
    });

    return NextResponse.json({
      success: true,
      projects: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Worker projects error:", error);

    return NextResponse.json(
      {
        error: "Unable to load projects.",
      },
      { status: 500 }
    );
  }
}
