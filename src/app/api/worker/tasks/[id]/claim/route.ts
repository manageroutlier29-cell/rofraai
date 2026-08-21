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

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      /*
       * Verify that the authenticated account is still
       * an active worker.
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
       * Load marketplace access.
       *
       * Every worker should have a WorkerAccess record,
       * but we handle a missing record explicitly instead
       * of silently bypassing the marketplace rules.
       */
      const access = await tx.workerAccess.findUnique({
        where: {
          workerId,
        },
      });

      if (!access) {
        throw new Error("WORKER_ACCESS_NOT_FOUND");
      }

      /*
       * Unlocked workers can continue claiming tasks.
       *
       * Locked workers may claim only while they remain
       * within their free-task allowance.
       */
      if (
        !access.isUnlocked &&
        access.tasksClaimed >= access.freeTaskLimit
      ) {
        throw new Error("FREE_TASK_LIMIT_REACHED");
      }

      /*
       * Load the task and its project.
       */
      const task = await tx.task.findUnique({
        where: {
          id: taskId,
        },
        select: {
          id: true,
          title: true,
          projectId: true,
          status: true,
          workerId: true,
          project: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (!task) {
        throw new Error("TASK_NOT_FOUND");
      }

      /*
       * A task may only be claimed while its project
       * is still open or in progress.
       */
      if (
        task.project.status !== "OPEN" &&
        task.project.status !== "IN_PROGRESS"
      ) {
        throw new Error("PROJECT_NOT_CLAIMABLE");
      }

      /*
       * If the worker already has an assignment for this
       * task, reject the request.
       */
      const existingAssignment =
        await tx.assignment.findUnique({
          where: {
            taskId_workerId: {
              taskId,
              workerId,
            },
          },
          select: {
            id: true,
            status: true,
          },
        });

      if (existingAssignment) {
        throw new Error("ALREADY_ASSIGNED");
      }

      /*
       * ATOMIC CLAIM
       *
       * The task is updated only if it is still AVAILABLE
       * and does not already have a worker.
       */
      const claimed = await tx.task.updateMany({
        where: {
          id: taskId,
          status: "AVAILABLE",
          workerId: null,
          project: {
            status: {
              in: ["OPEN", "IN_PROGRESS"],
            },
          },
        },
        data: {
          workerId,
          status: "ASSIGNED",
        },
      });

      if (claimed.count !== 1) {
        throw new Error("TASK_NOT_AVAILABLE");
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
       * Count this successful claim.
       *
       * This happens inside the same transaction as the
       * task claim, so a failed claim cannot consume a
       * free-task allowance.
       */
      const updatedAccess = await tx.workerAccess.updateMany({
        where: {
          workerId,
          ...(access.isUnlocked
            ? {}
            : {
                tasksClaimed: {
                  lt: access.freeTaskLimit,
                },
              }),
        },
        data: {
          tasksClaimed: {
            increment: 1,
          },
        },
      });

      if (updatedAccess.count !== 1) {
        throw new Error("FREE_TASK_LIMIT_REACHED");
      }

      /*
       * Return the updated records.
       */
      const updatedTask = await tx.task.findUnique({
        where: {
          id: taskId,
        },
      });

      const finalAccess = await tx.workerAccess.findUnique({
        where: {
          workerId,
        },
      });

      if (!updatedTask || !finalAccess) {
        throw new Error("STATE_SYNC_FAILED");
      }

      return {
        assignment,
        task: updatedTask,
        access: finalAccess,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Task claimed successfully.",
      assignment: result.assignment,
      task: result.task,
      access: {
        isUnlocked: result.access.isUnlocked,
        freeTaskLimit: result.access.freeTaskLimit,
        tasksClaimed: result.access.tasksClaimed,
        tasksRemaining: result.access.isUnlocked
          ? null
          : Math.max(
              result.access.freeTaskLimit -
                result.access.tasksClaimed,
              0
            ),
        unlockFee: result.access.unlockFee.toString(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "TASK_NOT_FOUND":
          return NextResponse.json(
            { error: "Task not found." },
            { status: 404 }
          );

        case "PROJECT_NOT_CLAIMABLE":
          return NextResponse.json(
            {
              error:
                "This task cannot be claimed because its project is no longer open.",
            },
            { status: 409 }
          );

        case "TASK_NOT_AVAILABLE":
          return NextResponse.json(
            {
              error:
                "This task is no longer available. Another worker may have claimed it.",
            },
            { status: 409 }
          );

        case "ALREADY_ASSIGNED":
          return NextResponse.json(
            {
              error:
                "You already have an assignment for this task.",
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
              error: "Your worker account is not active.",
            },
            { status: 403 }
          );

        case "WORKER_ACCESS_NOT_FOUND":
          return NextResponse.json(
            {
              error:
                "Your marketplace access record could not be found. Please contact support.",
            },
            { status: 500 }
          );

        case "FREE_TASK_LIMIT_REACHED":
          return NextResponse.json(
            {
              error:
                "You have reached your free task limit. Unlock marketplace access to claim more tasks.",
              requiresUnlock: true,
            },
            { status: 403 }
          );

        case "STATE_SYNC_FAILED":
          return NextResponse.json(
            {
              error:
                "The task claim could not be synchronized.",
            },
            { status: 409 }
          );
      }
    }

    /*
     * Prisma unique constraint errors are handled explicitly.
     */
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "This task has already been claimed or assigned.",
        },
        { status: 409 }
      );
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
