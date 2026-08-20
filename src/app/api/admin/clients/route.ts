import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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

    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
        status: "ACTIVE",
      },
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
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
    });

    return NextResponse.json({
      clients,
    });
  } catch (error) {
    console.error("Admin client lookup error:", error);

    return NextResponse.json(
      {
        error: "Failed to load clients.",
      },
      { status: 500 }
    );
  }
}
