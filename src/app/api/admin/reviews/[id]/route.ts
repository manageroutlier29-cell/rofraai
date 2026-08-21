import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const REVIEWABLE_SUBMISSION_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
] as const;

const ALLOWED_REVIEW_STATUSES = [
  "APPROVED",
  "REVISION_REQUIRED",
  "REJECTED",
] as const;

type ReviewDecision = (typeof ALLOWED_REVIEW_STATUSES)[number];

function isReviewDecision(value: unknown): value is ReviewDecision {
  return (
    typeof value === "string" &&
    ALLOWED_REVIEW_STATUSES.includes(
      value as ReviewDecision
    )
  );
}

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

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required." },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const status =
      "status" in body ? body.status : undefined;

    const rawScore =
      "score" in body ? body.score : null;

    const feedback =
      "feedback" in body ? body.feedback : null;

    const score: number | null =
      rawScore === null ||
      rawScore === undefined ||
      rawScore === ""
        ? null
        : typeof rawScore === "number"
          ? rawScore
          : typeof rawScore === "string"
            ? Number(rawScore)
            : NaN;

    if (!isReviewDecision(status)) {
      return NextResponse.json(
        { error: "Invalid review status." },
        { status: 400 }
      );
    }

    if (
      score !== null &&
      score !== undefined &&
      (
        !Number.isInteger(score) ||
        score < 0 ||
        score > 100
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Score must be an integer between 0 and 100.",
        },
        { status: 400 }
      );
    }

    if (
      feedback !== null &&
      feedback !== undefined &&
      typeof feedback !== "string"
    ) {
      return NextResponse.json(
        { error: "Feedback must be text." },
        { status: 400 }
      );
    }

    const normalizedFeedback =
      typeof feedback === "string"
        ? feedback.trim() || null
        : null;

    const result = await prisma.$transaction(
      async (tx) => {
        /*
         * IMPORTANT:
         * Read the submission inside the transaction.
         *
         * This prevents the initial state check from becoming
         * stale before the actual review decision is applied.
         */
        const submission =
          await tx.submission.findUnique({
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
          throw new Error("SUBMISSION_NOT_FOUND");
        }

        /*
         * Only a freshly submitted or actively reviewed
         * submission can receive a decision.
         */
        if (
          !REVIEWABLE_SUBMISSION_STATUSES.includes(
            submission.status as
              (typeof REVIEWABLE_SUBMISSION_STATUSES)[number]
          )
        ) {
          throw new Error("SUBMISSION_NOT_REVIEWABLE");
        }

        /*
         * The assignment must still belong to the submission
         * and be in the state expected by the review workflow.
         */
        if (
          submission.assignment.workerId !==
          submission.workerId
        ) {
          throw new Error("ASSIGNMENT_WORKER_MISMATCH");
        }

        if (
          submission.assignment.status !==
          "SUBMITTED"
        ) {
          throw new Error("ASSIGNMENT_NOT_SUBMITTED");
        }

        if (
          submission.assignment.task.status !==
          "SUBMITTED"
        ) {
          throw new Error("TASK_NOT_SUBMITTED");
        }

        /*
         * Approval must never create a second earning.
         */
        if (
          status === "APPROVED" &&
          submission.assignment.earning
        ) {
          throw new Error("EARNING_ALREADY_EXISTS");
        }

        const now = new Date();

        /*
         * Atomically claim the submission for this review
         * decision.
         *
         * A concurrent admin request will receive count = 0
         * after the first transaction changes the status.
         */
        const claimedSubmission =
          await tx.submission.updateMany({
            where: {
              id: submission.id,
              status: {
                in: [
                  "SUBMITTED",
                  "UNDER_REVIEW",
                ],
              },
            },
            data: {
              status,
              reviewedAt: now,
            },
          });

        if (claimedSubmission.count !== 1) {
          throw new Error("SUBMISSION_ALREADY_REVIEWED");
        }

        /*
         * Create the immutable review decision.
         */
        const review = await tx.review.create({
          data: {
            submissionId: submission.id,
            reviewerId: session.user.id,
            status,
            score:
              score === null ||
              score === undefined
                ? null
                : score,
            feedback: normalizedFeedback,
            reviewedAt: now,
          },
        });

        /*
         * APPROVED
         *
         * Complete assignment and task, then create the
         * earning, wallet credit, and financial transaction.
         */
        if (status === "APPROVED") {
          const assignmentUpdate =
            await tx.assignment.updateMany({
              where: {
                id: submission.assignmentId,
                workerId: submission.workerId,
                status: "SUBMITTED",
              },
              data: {
                status: "COMPLETED",
                completedAt: now,
              },
            });

          if (assignmentUpdate.count !== 1) {
            throw new Error(
              "ASSIGNMENT_STATE_CHANGED"
            );
          }

          const taskUpdate =
            await tx.task.updateMany({
              where: {
                id: submission.assignment.taskId,
                workerId: submission.workerId,
                status: "SUBMITTED",
              },
              data: {
                status: "COMPLETED",
              },
            });

          if (taskUpdate.count !== 1) {
            throw new Error(
              "TASK_STATE_CHANGED"
            );
          }

          const earning = await tx.earning.create({
            data: {
              workerId: submission.workerId,
              assignmentId:
                submission.assignmentId,
              amount:
                submission.assignment.task.reward,
              status: "AVAILABLE",
              description:
                `Payment for completed task: ${submission.assignment.task.title}`,
              availableAt: now,
            },
          });

          const wallet =
            await tx.workerWallet.upsert({
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

          const transaction =
            await tx.transaction.create({
              data: {
                userId: submission.workerId,
                type: "TASK_EARNING",
                status: "COMPLETED",
                amount:
                  submission.assignment.task.reward,
                currency: "USD",
                reference: earning.id,
                description:
                  `Earning for completed task: ${submission.assignment.task.title}`,
                metadata: {
                  earningId: earning.id,
                  assignmentId:
                    submission.assignmentId,
                  taskId:
                    submission.assignment.taskId,
                  submissionId:
                    submission.id,
                },
              },
            });

          const assignment =
            await tx.assignment.findUnique({
              where: {
                id: submission.assignmentId,
              },
            });

          const task = await tx.task.findUnique({
            where: {
              id: submission.assignment.taskId,
            },
          });

          return {
            review,
            submission: {
              ...submission,
              status,
              reviewedAt: now,
            },
            assignment,
            task,
            earning,
            wallet,
            transaction,
          };
        }

        /*
         * REVISION REQUIRED
         *
         * The worker is allowed to continue working on the
         * same assignment and submit a new submission.
         */
        if (status === "REVISION_REQUIRED") {
          const assignmentUpdate =
            await tx.assignment.updateMany({
              where: {
                id: submission.assignmentId,
                workerId: submission.workerId,
                status: "SUBMITTED",
              },
              data: {
                status: "IN_PROGRESS",
              },
            });

          if (assignmentUpdate.count !== 1) {
            throw new Error(
              "ASSIGNMENT_STATE_CHANGED"
            );
          }

          const taskUpdate =
            await tx.task.updateMany({
              where: {
                id: submission.assignment.taskId,
                workerId: submission.workerId,
                status: "SUBMITTED",
              },
              data: {
                status: "IN_PROGRESS",
              },
            });

          if (taskUpdate.count !== 1) {
            throw new Error(
              "TASK_STATE_CHANGED"
            );
          }

          const assignment =
            await tx.assignment.findUnique({
              where: {
                id: submission.assignmentId,
              },
            });

          const task = await tx.task.findUnique({
            where: {
              id: submission.assignment.taskId,
            },
          });

          return {
            review,
            submission: {
              ...submission,
              status,
              reviewedAt: now,
            },
            assignment,
            task,
            earning: null,
            wallet: null,
            transaction: null,
          };
        }

        /*
         * REJECTED
         *
         * Rejected work permanently closes this assignment.
         */
        const assignmentUpdate =
          await tx.assignment.updateMany({
            where: {
              id: submission.assignmentId,
              workerId: submission.workerId,
              status: "SUBMITTED",
            },
            data: {
              status: "REJECTED",
            },
          });

        if (assignmentUpdate.count !== 1) {
          throw new Error(
            "ASSIGNMENT_STATE_CHANGED"
          );
        }

        const taskUpdate =
          await tx.task.updateMany({
            where: {
              id: submission.assignment.taskId,
              workerId: submission.workerId,
              status: "SUBMITTED",
            },
            data: {
              status: "CANCELLED",
            },
          });

        if (taskUpdate.count !== 1) {
          throw new Error(
            "TASK_STATE_CHANGED"
          );
        }

        const assignment =
          await tx.assignment.findUnique({
            where: {
              id: submission.assignmentId,
            },
          });

        const task = await tx.task.findUnique({
          where: {
            id: submission.assignment.taskId,
          },
        });

        return {
          review,
          submission: {
            ...submission,
            status,
            reviewedAt: now,
          },
          assignment,
          task,
          earning: null,
          wallet: null,
          transaction: null,
        };
      }
    );

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
    if (error instanceof Error) {
      switch (error.message) {
        case "SUBMISSION_NOT_FOUND":
          return NextResponse.json(
            { error: "Submission not found." },
            { status: 404 }
          );

        case "SUBMISSION_NOT_REVIEWABLE":
          return NextResponse.json(
            {
              error:
                "This submission has already been reviewed or is not currently reviewable.",
            },
            { status: 409 }
          );

        case "SUBMISSION_ALREADY_REVIEWED":
          return NextResponse.json(
            {
              error:
                "This submission was already processed by another review action.",
            },
            { status: 409 }
          );

        case "ASSIGNMENT_WORKER_MISMATCH":
          return NextResponse.json(
            {
              error:
                "The submission and assignment worker do not match.",
            },
            { status: 409 }
          );

        case "ASSIGNMENT_NOT_SUBMITTED":
          return NextResponse.json(
            {
              error:
                "The assignment is not currently awaiting review.",
            },
            { status: 409 }
          );

        case "TASK_NOT_SUBMITTED":
          return NextResponse.json(
            {
              error:
                "The task is not currently awaiting review.",
            },
            { status: 409 }
          );

        case "EARNING_ALREADY_EXISTS":
          return NextResponse.json(
            {
              error:
                "This assignment has already generated an earning.",
            },
            { status: 409 }
          );

        case "ASSIGNMENT_STATE_CHANGED":
          return NextResponse.json(
            {
              error:
                "The assignment state changed before the review could be completed.",
            },
            { status: 409 }
          );

        case "TASK_STATE_CHANGED":
          return NextResponse.json(
            {
              error:
                "The task state changed before the review could be completed.",
            },
            { status: 409 }
          );
      }
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "An earning or review record already exists for this operation.",
        },
        { status: 409 }
      );
    }

    console.error("Admin review error:", error);

    return NextResponse.json(
      {
        error: "Failed to process review.",
      },
      { status: 500 }
    );
  }
}
