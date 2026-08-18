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
        { error: "Score must be an integer between 0 and 100" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: {
        id,
      },
      include: {
        assignment: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
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

      await tx.submission.update({
        where: {
          id: submission.id,
        },
        data: {
          status,
          reviewedAt: new Date(),
        },
      });

      if (status === "APPROVED") {
        await tx.assignment.update({
          where: {
            id: submission.assignmentId,
          },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });
      }

      if (status === "REVISION_REQUIRED") {
        await tx.assignment.update({
          where: {
            id: submission.assignmentId,
          },
          data: {
            status: "IN_PROGRESS",
          },
        });
      }

      if (status === "REJECTED") {
        await tx.assignment.update({
          where: {
            id: submission.assignmentId,
          },
          data: {
            status: "REJECTED",
          },
        });
      }

      return review;
    });

    return NextResponse.json({
      success: true,
      review: result,
    });
  } catch (error) {
    console.error("Admin review error:", error);

    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 500 }
    );
  }
}