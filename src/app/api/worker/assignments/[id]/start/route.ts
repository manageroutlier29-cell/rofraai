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

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      /*
       * Verify the worker account is still active.
       */
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

      /*
       * Load the assignment belonging to this worker.
       */
      const assignment = await tx.assignment.findFirst({
        where: {
          id: assignmentId,
          workerId,
        },
        select: {
          id: true,
          taskId: true,
          status: true,
          task: {
            select: {
              id: true,
              status: true,
              workerId: true,
            },
          },
        },
      });

      if (!assignment) {
        throw new Error("ASSIGNMENT_NOT_FOUND");
      }

      if (assignment.status !== "PENDING") {
        throw new Error("INVALID_STATUS");
      }

      if (
        assignment.task.status !== "ASSIGNED" ||
        assignment.task.workerId !== workerId
      ) {
        throw new Error("TASK_NOT_ASSIGNED");
      }

      /*
       * Atomically transition the assignment.
       *
       * Only a PENDING assignment owned by this worker
       * can transition to IN_PROGRESS.
       */
      const startedAt = new Date();

      const assignmentUpdate =
        await tx.assignment.updateMany({
          where: {
            id: assignmentId,
            workerId,
            status: "PENDING",
          },
          data: {
            status: "IN_PROGRESS",
            startedAt,
          },
        });

      if (assignmentUpdate.count !== 1) {
        throw new Error("INVALID_STATUS");
      }

      /*
       * Synchronize the task state.
       *
       * Only the assigned worker's task can transition
       * from ASSIGNED to IN_PROGRESS.
       */
      const taskUpdate = await tx.task.updateMany({
        where: {
          id: assignment.taskId,
          workerId,
          status: "ASSIGNED",
        },
        data: {
          status: "IN_PROGRESS",
        },
      });

      if (taskUpdate.count !== 1) {
        throw new Error("TASK_NOT_ASSIGNED");
      }

      /*
       * Return the final records.
       */
      const updatedAssignment =
        await tx.assignment.findUnique({
          where: {
            id: assignmentId,
          },
        });

      const updatedTask = await tx.task.findUnique({
        where: {
          id: assignment.taskId,
        },
      });

      if (!updatedAssignment || !updatedTask) {
        throw new Error("STATE_SYNC_FAILED");
      }

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
        case "WORKER_NOT_FOUND":
          return NextResponse.json(
            { error: "Worker account could not be found." },
            { status: 404 }
          );

        case "WORKER_NOT_ACTIVE":
          return NextResponse.json(
            { error: "Your worker account is not active." },
            { status: 403 }
          );

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

        case "STATE_SYNC_FAILED":
          return NextResponse.json(
            {
              error:
                "The assignment state could not be synchronized.",
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
