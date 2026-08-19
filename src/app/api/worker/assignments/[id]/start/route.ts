import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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
        { error: "Only workers can start assignments." },
        { status: 403 }
      );
    }

    const workerId = session.user.id;
    const { id: assignmentId } = await context.params;

    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.findFirst({
        where: {
          id: assignmentId,
          workerId,
        },
        include: {
          task: true,
        },
      });

      if (!assignment) {
        throw new Error("ASSIGNMENT_NOT_FOUND");
      }

      if (assignment.status !== "PENDING") {
        throw new Error("INVALID_STATUS");
      }

      if (assignment.task.status !== "ASSIGNED") {
        throw new Error("TASK_NOT_ASSIGNED");
      }

      const startedAt = new Date();

      const updatedAssignment = await tx.assignment.update({
        where: {
          id: assignment.id,
        },
        data: {
          status: "IN_PROGRESS",
          startedAt,
        },
      });

      const updatedTask = await tx.task.update({
        where: {
          id: assignment.taskId,
        },
        data: {
          status: "IN_PROGRESS",
        },
      });

      return {
        assignment: updatedAssignment,
        task: updatedTask,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Work started successfully.",
      assignment: result.assignment,
      task: result.task,
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "ASSIGNMENT_NOT_FOUND":
          return NextResponse.json(
            { error: "Assignment not found." },
            { status: 404 }
          );

        case "INVALID_STATUS":
          return NextResponse.json(
            {
              error:
                "This assignment cannot be started in its current status.",
            },
            { status: 409 }
          );

        case "TASK_NOT_ASSIGNED":
          return NextResponse.json(
            {
              error:
                "This task is not currently assigned to you.",
            },
            { status: 409 }
          );
      }
    }

    console.error("Start assignment error:", error);

    return NextResponse.json(
      {
        error: "Unable to start the assignment.",
      },
      { status: 500 }
    );
  }
}
