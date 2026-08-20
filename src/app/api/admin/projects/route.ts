import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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

    const {
      clientId,
      title,
      description,
      category,
      budget,
      deadline,
    } = body;

    if (
      !clientId ||
      !title ||
      !description ||
      !category ||
      budget === undefined ||
      budget === null
    ) {
      return NextResponse.json(
        {
          error:
            "Client, title, description, category and budget are required.",
        },
        { status: 400 }
      );
    }

    const parsedBudget = Number(budget);

    if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      return NextResponse.json(
        {
          error: "Budget must be a number greater than 0.",
        },
        { status: 400 }
      );
    }

    const client = await prisma.user.findFirst({
      where: {
        id: clientId,
        role: "CLIENT",
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          error: "Active client not found.",
        },
        { status: 404 }
      );
    }

    let parsedDeadline: Date | null = null;

    if (deadline) {
      parsedDeadline = new Date(deadline);

      if (Number.isNaN(parsedDeadline.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid deadline.",
          },
          { status: 400 }
        );
      }
    }

    const project = await prisma.project.create({
      data: {
        clientId: client.id,
        title: String(title).trim(),
        description: String(description).trim(),
        category: String(category).trim(),
        budget: parsedBudget,
        status: "DRAFT",
        deadline: parsedDeadline,
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        budget: true,
        status: true,
        deadline: true,
        createdAt: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            clientProfile: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully.",
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin project creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create project.",
      },
      { status: 500 }
    );
  }
}
