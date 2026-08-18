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
        { error: "You must be logged in to claim a task." },
        { status: 401 }
      );
    }

    if (session.user.role !== "WORKER") {
      return NextResponse.json(
        { error: "Only workers can claim tasks." },
        { status: 403 }
      );
    }

    const workerId = session.user.id;
    const { id: taskId } = await context.params;

    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: {
          id: taskId,
        },
      });

      if (!task) {
        throw new Error("TASK_NOT_FOUND");
      }

      if (task.status !== "AVAILABLE") {
        throw new Error("TASK_NOT_AVAILABLE");
      }

      const worker = await tx.user.findUnique({
        where: {
          id: workerId,
        },
        select: {
          id: true,
          role: true,
          status: true,
        },
      });

      if (!worker) {
        throw new Error("WORKER_NOT_FOUND");
      }

      if (
        worker.role !== "WORKER" ||
        worker.status !== "ACTIVE"
      ) {
        throw new Error("WORKER_NOT_ACTIVE");
      }

      const existingAssignment =
        await tx.assignment.findFirst({
          where: {
            taskId,
            workerId,
            status: {
              not: "CANCELLED",
            },
          },
        });

      if (existingAssignment) {
        throw new Error("ALREADY_ASSIGNED");
      }

      /*
       * Create the worker assignment.
       */
      const assignment = await tx.assignment.create({
        data: {
          taskId,
          workerId,
          status: "PENDING",
          assignedAt: new Date(),
        },
      });

      /*
       * Mark the task as assigned to this worker.
       */
      const updatedTask = await tx.task.update({
        where: {
          id: taskId,
        },
        data: {
          workerId,
          status: "ASSIGNED",
        },
      });

      return {
        assignment,
        task: updatedTask,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Task claimed successfully.",
      assignment: result.assignment,
      task: result.task,
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "TASK_NOT_FOUND":
          return NextResponse.json(
            { error: "Task not found." },
            { status: 404 }
          );

        case "TASK_NOT_AVAILABLE":
          return NextResponse.json(
            {
              error:
                "This task is no longer available.",
            },
            { status: 409 }
          );

        case "ALREADY_ASSIGNED":
          return NextResponse.json(
            {
              error:
                "You have already claimed this task.",
            },
            { status: 409 }
          );

        case "WORKER_NOT_FOUND":
          return NextResponse.json(
            {
              error: "Worker account could not be found.",
            },
            { status: 404 }
          );

        case "WORKER_NOT_ACTIVE":
          return NextResponse.json(
            {
              error:
                "Your worker account is not active.",
            },
            { status: 403 }
          );
      }
    }

    console.error("Claim task error:", error);

    return NextResponse.json(
      {
        error: "Unable to claim task.",
      },
      { status: 500 }
    );
  }
}