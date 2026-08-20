import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        assignments: {
          select: {
            id: true,
            earning: {
              select: {
                id: true,
              },
            },
            submissions: {
              select: {
                id: true,
                reviews: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    const hasWorkerActivity = task.assignments.some(
      (assignment) =>
        assignment.earning !== null ||
        assignment.submissions.length > 0
    );

    const hasAssignment = task.assignments.length > 0;

    if (hasAssignment || hasWorkerActivity) {
      return NextResponse.json(
        {
          error:
            "This task cannot be deleted because it has worker activity or an assignment. Cancel the task instead to preserve the work history.",
        },
        { status: 409 }
      );
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Task "${task.title}" deleted successfully.`,
    });
  } catch (error) {
    console.error("Admin task deletion error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete task.",
      },
      { status: 500 }
    );
  }
}
