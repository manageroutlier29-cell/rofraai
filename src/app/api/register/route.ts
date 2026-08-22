import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = "WORKER";

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All required fields must be completed." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash,
          role: role as "WORKER" | "CLIENT",
          status: "ACTIVE",
        },
      });

      if (role === "WORKER") {
        await tx.workerProfile.create({
          data: {
            userId: createdUser.id,
          },
        });

        await tx.workerWallet.create({
          data: {
            workerId: createdUser.id,
          },
        });

        await tx.workerAccess.create({
          data: {
            workerId: createdUser.id,
          },
        });
      }

      return createdUser;
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Unable to create your account." },
      { status: 500 }
    );
  }
}
