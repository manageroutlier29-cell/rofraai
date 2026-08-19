import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function mask(value: string | null) {
  if (!value) return null;

  if (value.length <= 4) {
    return "••••";
  }

  return `••••${value.slice(-4)}`;
}

function serializeAccount(account: {
  id: string;
  type: "MPESA" | "BANK";
  status: "ACTIVE" | "INACTIVE";
  isDefault: boolean;
  accountName: string | null;
  phoneNumber: string | null;
  bankName: string | null;
  accountNumber: string | null;
  bankCode: string | null;
  country: string;
  currency: string;
  provider: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: account.id,
    type: account.type,
    status: account.status,
    isDefault: account.isDefault,
    accountName: account.accountName,
    phoneNumber: mask(account.phoneNumber),
    bankName: account.bankName,
    accountNumber: mask(account.accountNumber),
    bankCode: account.bankCode,
    country: account.country,
    currency: account.currency,
    provider: account.provider,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export async function GET() {
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
        { error: "Only workers can access payment accounts." },
        { status: 403 }
      );
    }

    const accounts = await prisma.paymentAccount.findMany({
      where: {
        workerId: session.user.id,
      },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      accounts: accounts.map(serializeAccount),
    });
  } catch (error) {
    console.error("Payment accounts GET error:", error);

    return NextResponse.json(
      { error: "Unable to load payment accounts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
        { error: "Only workers can create payment accounts." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const type =
      typeof body.type === "string"
        ? body.type.trim().toUpperCase()
        : "";

    if (!["MPESA", "BANK"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid payment account type." },
        { status: 400 }
      );
    }

    const accountName =
      typeof body.accountName === "string"
        ? body.accountName.trim()
        : null;

    const phoneNumber =
      typeof body.phoneNumber === "string"
        ? body.phoneNumber.trim()
        : null;

    const bankName =
      typeof body.bankName === "string"
        ? body.bankName.trim()
        : null;

    const accountNumber =
      typeof body.accountNumber === "string"
        ? body.accountNumber.trim()
        : null;

    const bankCode =
      typeof body.bankCode === "string"
        ? body.bankCode.trim()
        : null;

    const requestedDefault = body.isDefault === true;

    if (type === "MPESA") {
      if (!phoneNumber) {
        return NextResponse.json(
          { error: "M-Pesa phone number is required." },
          { status: 400 }
        );
      }

      if (!/^(?:254|\+254|0)7\d{8}$/.test(phoneNumber)) {
        return NextResponse.json(
          { error: "Enter a valid Kenyan M-Pesa phone number." },
          { status: 400 }
        );
      }
    }

    if (type === "BANK") {
      if (!accountName || !bankName || !accountNumber) {
        return NextResponse.json(
          {
            error:
              "Account name, bank name and account number are required.",
          },
          { status: 400 }
        );
      }
    }

    const workerId = session.user.id;

    const account = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.paymentAccount.count({
        where: {
          workerId,
          status: "ACTIVE",
        },
      });

      const makeDefault = requestedDefault || existingCount === 0;

      if (makeDefault) {
        await tx.paymentAccount.updateMany({
          where: {
            workerId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.paymentAccount.create({
        data: {
          workerId,
          type,
          status: "ACTIVE",
          isDefault: makeDefault,
          accountName,
          phoneNumber,
          bankName,
          accountNumber,
          bankCode,
          country: "KE",
          currency: "KES",
          provider: "INTASEND",
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        account: serializeAccount(account),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment account POST error:", error);

    return NextResponse.json(
      { error: "Unable to save payment account." },
      { status: 500 }
    );
  }
}
