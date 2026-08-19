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

    const { id: assignmentId } = await context.params;

    const body = await request.json();

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (!content) {
      return NextResponse.json(
        {
          error: "Please enter your completed work before submitting.",
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

    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        workerId: session.user.id,
      },
      include: {
        task: true,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        {
          error: "Assignment not found.",
        },
        { status: 404 }
      );
    }

    if (assignment.status !== "IN_PROGRESS") {
      return NextResponse.json(
        {
          error:
            "You can only submit an assignment that is currently in progress.",
        },
        { status: 409 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const submission = await tx.submission.create({
        data: {
          assignmentId: assignment.id,
          workerId: session.user.id,
          content,
          status: "SUBMITTED",
          submittedAt: new Date(),
        },
      });

      const updatedAssignment = await tx.assignment.update({
        where: {
          id: assignment.id,
        },
        data: {
          status: "SUBMITTED",
          submittedAt: new Date(),
        },
      });

      const updatedTask = await tx.task.update({
        where: {
          id: assignment.taskId,
        },
        data: {
          status: "SUBMITTED",
        },
      });

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
    console.error("Submit work error:", error);

    return NextResponse.json(
      {
        error: "Unable to submit your work.",
      },
      { status: 500 }
    );
  }
}
