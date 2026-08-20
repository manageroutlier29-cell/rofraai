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
        { error: "Project ID is required." },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        tasks: {
          select: {
            id: true,
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
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const hasWorkerActivity = project.tasks.some(
  (task) => task.assignments.length > 0
);

if (hasWorkerActivity) {
  return NextResponse.json(
    {
      error:
        "This project cannot be deleted because one or more tasks have worker assignments or activity. Cancel the project instead to preserve the work history.",
    },
    { status: 409 }
  );
}

       await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Project "${project.title}" deleted successfully.`,
    });
  } catch (error) {
    console.error("Admin project deletion error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete project.",
      },
      { status: 500 }
    );
  }
}
