import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await request.json();

    const { status, score, feedback } = body;

    const allowedStatuses = [
      "APPROVED",
      "REVISION_REQUIRED",
      "REJECTED",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid review status" },
        { status: 400 }
      );
    }

    if (
      score !== undefined &&
      score !== null &&
      (!Number.isInteger(score) || score < 0 || score > 100)
    ) {
      return NextResponse.json(
        {
          error: "Score must be an integer between 0 and 100",
        },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: {
        id,
      },
      include: {
        assignment: {
          include: {
            task: true,
            earning: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    /*
     * Only submitted or actively reviewed submissions
     * can receive a new admin decision.
     *
     * This prevents an already approved, rejected, or
     * revision-required submission from being processed
     * again accidentally.
     */
    const reviewableStatuses = [
      "SUBMITTED",
      "UNDER_REVIEW",
    ];

    if (!reviewableStatuses.includes(submission.status)) {
      return NextResponse.json(
        {
          error: `This submission cannot be reviewed because its current status is ${submission.status}.`,
        },
        { status: 409 }
      );
    }

    /*
     * An assignment can only have one earning.
     *
     * This is a second layer of protection against
     * duplicate worker payments.
     */
    if (status === "APPROVED" && submission.assignment.earning) {
      return NextResponse.json(
        {
          error:
            "This assignment has already generated an earning.",
        },
        { status: 409 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      /*
       * Create the review record.
       */
      const review = await tx.review.create({
        data: {
          submissionId: submission.id,
          reviewerId: session.user.id,
          status,
          score: score ?? null,
          feedback: feedback ?? null,
          reviewedAt: new Date(),
        },
      });

      /*
       * Update the submission.
       */
      const updatedSubmission = await tx.submission.update({
        where: {
          id: submission.id,
        },
        data: {
          status,
          reviewedAt: new Date(),
        },
      });

      /*
       * APPROVED
       *
       * Complete the assignment and task,
       * then create the worker's earning,
       * wallet credit, and financial transaction.
       */
      if (status === "APPROVED") {
        const completedAssignment =
          await tx.assignment.update({
            where: {
              id: submission.assignmentId,
            },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
            },
          });

        await tx.task.update({
          where: {
            id: submission.assignment.taskId,
          },
          data: {
            status: "COMPLETED",
          },
        });

        const earning = await tx.earning.create({
          data: {
            workerId: submission.workerId,
            assignmentId: completedAssignment.id,
            amount: submission.assignment.task.reward,
            status: "AVAILABLE",
            description:
              `Payment for completed task: ${submission.assignment.task.title}`,
            availableAt: new Date(),
          },
        });

        const wallet = await tx.workerWallet.upsert({
          where: {
            workerId: submission.workerId,
          },
          create: {
            workerId: submission.workerId,
            availableBalance:
              submission.assignment.task.reward,
          },
          update: {
            availableBalance: {
              increment:
                submission.assignment.task.reward,
            },
          },
        });

        const transaction = await tx.transaction.create({
          data: {
            userId: submission.workerId,
            type: "TASK_EARNING",
            status: "COMPLETED",
            amount: submission.assignment.task.reward,
            currency: "USD",
            reference: earning.id,
            description:
              `Earning for completed task: ${submission.assignment.task.title}`,
            metadata: {
              earningId: earning.id,
              assignmentId: completedAssignment.id,
              taskId: submission.assignment.task.id,
            },
          },
        });

        return {
          review,
          submission: updatedSubmission,
          assignment: completedAssignment,
          earning,
          wallet,
          transaction,
        };
      }

      /*
       * REVISION REQUIRED
       *
       * The worker can submit another Submission
       * for the same Assignment.
       */
      if (status === "REVISION_REQUIRED") {
        const updatedAssignment =
          await tx.assignment.update({
            where: {
              id: submission.assignmentId,
            },
            data: {
              status: "IN_PROGRESS",
            },
          });

        await tx.task.update({
          where: {
            id: submission.assignment.taskId,
          },
          data: {
            status: "IN_PROGRESS",
          },
        });

        return {
          review,
          submission: updatedSubmission,
          assignment: updatedAssignment,
          earning: null,
          wallet: null,
          transaction: null,
        };
      }

      /*
       * REJECTED
       */
      if (status === "REJECTED") {
        const rejectedAssignment =
          await tx.assignment.update({
            where: {
              id: submission.assignmentId,
            },
            data: {
              status: "REJECTED",
            },
          });

        await tx.task.update({
          where: {
            id: submission.assignment.taskId,
          },
          data: {
            status: "CANCELLED",
          },
        });

        return {
          review,
          submission: updatedSubmission,
          assignment: rejectedAssignment,
          earning: null,
          wallet: null,
          transaction: null,
        };
      }

      return {
        review,
        submission: updatedSubmission,
        assignment: null,
        earning: null,
        wallet: null,
        transaction: null,
      };
    });

    return NextResponse.json({
      success: true,
      message:
        status === "APPROVED"
          ? "Submission approved and worker earning created."
          : status === "REVISION_REQUIRED"
            ? "Revision requested successfully."
            : "Submission rejected successfully.",
      ...result,
    });
  } catch (error) {
    console.error("Admin review error:", error);

    /*
     * Prisma unique constraint.
     *
     * This remains as a final database-level safety net
     * against duplicate earnings.
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
            "An earning already exists for this assignment.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process review",
      },
      { status: 500 }
    );
  }
}
