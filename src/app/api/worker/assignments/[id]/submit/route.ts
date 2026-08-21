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
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "WORKER") {
      return NextResponse.json(
        {
          error: "Only workers can submit work.",
        },
        { status: 403 }
      );
    }

    const workerId = session.user.id;
    const { id: assignmentId } = await context.params;

    if (!assignmentId) {
      return NextResponse.json(
        {
          error: "Assignment ID is required.",
        },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const content =
      typeof body === "object" &&
      body !== null &&
      "content" in body &&
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (!content) {
      return NextResponse.json(
        {
          error:
            "Please enter your completed work before submitting.",
        },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        {
          error: "Your submission is too short.",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      /*
       * Verify that the worker account is still active.
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

      if (assignment.status !== "IN_PROGRESS") {
        throw new Error("INVALID_ASSIGNMENT_STATUS");
      }

      if (
        assignment.task.status !== "IN_PROGRESS" ||
        assignment.task.workerId !== workerId
      ) {
        throw new Error("TASK_NOT_IN_PROGRESS");
      }

      /*
       * Atomically move the assignment from IN_PROGRESS
       * to SUBMITTED.
       *
       * This prevents two simultaneous submit requests
       * from both creating a submission for the same
       * active work cycle.
       */
      const submittedAt = new Date();

      const assignmentUpdate =
        await tx.assignment.updateMany({
          where: {
            id: assignmentId,
            workerId,
            status: "IN_PROGRESS",
          },
          data: {
            status: "SUBMITTED",
            submittedAt,
          },
        });

      if (assignmentUpdate.count !== 1) {
        throw new Error("INVALID_ASSIGNMENT_STATUS");
      }

      /*
       * Synchronize the task state.
       */
      const taskUpdate = await tx.task.updateMany({
        where: {
          id: assignment.taskId,
          workerId,
          status: "IN_PROGRESS",
        },
        data: {
          status: "SUBMITTED",
        },
      });

      if (taskUpdate.count !== 1) {
        throw new Error("TASK_NOT_IN_PROGRESS");
      }

      /*
       * Create the submission after the assignment has
       * successfully transitioned.
       *
       * If submission creation fails, the entire transaction
       * rolls back the assignment and task transitions.
       */
      const submission = await tx.submission.create({
        data: {
          assignmentId: assignment.id,
          workerId,
          content,
          status: "SUBMITTED",
          submittedAt,
        },
      });

      /*
       * Return the final synchronized records.
       */
      const updatedAssignment =
        await tx.assignment.findUnique({
          where: {
            id: assignment.id,
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
        submission,
        assignment: updatedAssignment,
        task: updatedTask,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Work submitted successfully.",
      submission: result.submission,
      assignment: result.assignment,
      task: result.task,
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
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

        case "ASSIGNMENT_NOT_FOUND":
          return NextResponse.json(
            {
              error: "Assignment not found.",
            },
            { status: 404 }
          );

        case "INVALID_ASSIGNMENT_STATUS":
          return NextResponse.json(
            {
              error:
                "You can only submit an assignment that is currently in progress.",
            },
            { status: 409 }
          );

        case "TASK_NOT_IN_PROGRESS":
          return NextResponse.json(
            {
              error:
                "This task is not currently in progress for you.",
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

    console.error("Submit work error:", error);

    return NextResponse.json(
      {
        error: "Unable to submit your work.",
      },
      { status: 500 }
    );
  }
}
