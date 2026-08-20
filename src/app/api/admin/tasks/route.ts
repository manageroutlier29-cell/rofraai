import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";

    const projectId =
      typeof body.projectId === "string"
        ? body.projectId
        : "";

    const reward = Number(body.reward);

    const deadline =
      body.deadline
        ? new Date(body.deadline)
        : null;

    if (!title) {
      return NextResponse.json(
        { error: "Task title is required." },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Task description is required." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Task category is required." },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "Please select a project." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(reward) || reward <= 0) {
      return NextResponse.json(
        { error: "Reward must be greater than zero." },
        { status: 400 }
      );
    }

    if (
      deadline &&
      Number.isNaN(deadline.getTime())
    ) {
      return NextResponse.json(
        { error: "Invalid deadline." },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    if (
      project.status !== "OPEN" &&
      project.status !== "IN_PROGRESS"
    ) {
      return NextResponse.json(
        {
          error:
            "Tasks can only be created under an open or active project.",
        },
        { status: 409 }
      );
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        category,
        reward,
        status: "AVAILABLE",
        deadline,
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        reward: true,
        status: true,
        deadline: true,
        projectId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully.",
        task: {
          ...task,
          reward: task.reward.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin create task error:", error);

    return NextResponse.json(
      {
        error: "Unable to create task.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    const projects = await prisma.project.findMany({
      where: {
        status: {
          in: ["OPEN", "IN_PROGRESS"],
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      projects,
    });
  } catch (error) {
    console.error("Admin task projects error:", error);

    return NextResponse.json(
      {
        error: "Unable to load projects.",
      },
      { status: 500 }
    );
  }
}
