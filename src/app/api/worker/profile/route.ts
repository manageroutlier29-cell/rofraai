import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getWorker() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "WORKER") {
    return {
      error: NextResponse.json(
        { error: "Only workers can access this profile." },
        { status: 403 }
      ),
    };
  }

  return {
    workerId: session.user.id,
  };
}

export async function GET() {
  try {
    const worker = await getWorker();

    if ("error" in worker) {
      return worker.error;
    }

    const profile = await prisma.workerProfile.upsert({
      where: {
        userId: worker.workerId,
      },
      create: {
        userId: worker.workerId,
      },
      update: {},
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        userId: profile.userId,
        bio: profile.bio,
        skills: profile.skills,
        country: profile.country,
        experience: profile.experience,
        resumeUrl: profile.resumeUrl,
        resumeName: profile.resumeName,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error("Worker profile GET error:", error);

    return NextResponse.json(
      { error: "Unable to load your profile." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const worker = await getWorker();

    if ("error" in worker) {
      return worker.error;
    }

    const body = await request.json();

    const bio =
      typeof body.bio === "string" ? body.bio.trim() : undefined;

    const skills =
      typeof body.skills === "string" ? body.skills.trim() : undefined;

    const country =
      typeof body.country === "string" ? body.country.trim() : undefined;

    const experience =
      typeof body.experience === "string"
        ? body.experience.trim()
        : undefined;

    const resumeUrl =
      typeof body.resumeUrl === "string"
        ? body.resumeUrl.trim()
        : undefined;

    const resumeName =
      typeof body.resumeName === "string"
        ? body.resumeName.trim()
        : undefined;

    const profile = await prisma.workerProfile.upsert({
      where: {
        userId: worker.workerId,
      },
      create: {
        userId: worker.workerId,
        bio,
        skills,
        country,
        experience,
        resumeUrl,
        resumeName,
      },
      update: {
        ...(bio !== undefined ? { bio } : {}),
        ...(skills !== undefined ? { skills } : {}),
        ...(country !== undefined ? { country } : {}),
        ...(experience !== undefined ? { experience } : {}),
        ...(resumeUrl !== undefined ? { resumeUrl } : {}),
        ...(resumeName !== undefined ? { resumeName } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        userId: profile.userId,
        bio: profile.bio,
        skills: profile.skills,
        country: profile.country,
        experience: profile.experience,
        resumeUrl: profile.resumeUrl,
        resumeName: profile.resumeName,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error("Worker profile PUT error:", error);

    return NextResponse.json(
      { error: "Unable to update your profile." },
      { status: 500 }
    );
  }
}
