import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    if (session.user.role !== "WORKER") {
      return NextResponse.json(
        { error: "Only workers can modify payment accounts." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const account = await prisma.paymentAccount.findFirst({
      where: {
        id,
        workerId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Payment account not found." },
        { status: 404 }
      );
    }

    const updates: {
      isDefault?: boolean;
      status?: "ACTIVE" | "INACTIVE";
    } = {};

    if (typeof body.isDefault === "boolean") {
      updates.isDefault = body.isDefault;
    }

    if (body.status === "ACTIVE" || body.status === "INACTIVE") {
      updates.status = body.status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid changes supplied." },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (updates.isDefault === true) {
        await tx.paymentAccount.updateMany({
          where: {
            workerId: session.user.id,
            isDefault: true,
            id: {
              not: id,
            },
          },
          data: {
            isDefault: false,
          },
        });
      }

      if (updates.status === "INACTIVE" && account.isDefault) {
        const replacement = await tx.paymentAccount.findFirst({
          where: {
            workerId: session.user.id,
            status: "ACTIVE",
            id: {
              not: id,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        if (replacement) {
          await tx.paymentAccount.update({
            where: {
              id: replacement.id,
            },
            data: {
              isDefault: true,
            },
          });

          updates.isDefault = false;
        }
      }

      return tx.paymentAccount.update({
        where: {
          id,
        },
        data: updates,
      });
    });

    return NextResponse.json({
      success: true,
      account: {
        id: updated.id,
        type: updated.type,
        status: updated.status,
        isDefault: updated.isDefault,
      },
    });
  } catch (error) {
    console.error("Payment account PATCH error:", error);

    return NextResponse.json(
      { error: "Unable to update payment account." },
      { status: 500 }
    );
  }
}
