import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

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
        { error: "Only workers can upload resumes." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("resume");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select a resume file." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "The selected file is empty." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    const extension = ALLOWED_TYPES[file.type];

    if (!extension) {
      return NextResponse.json(
        { error: "Only PDF, DOC, and DOCX resumes are allowed." },
        { status: 400 }
      );
    }

    const workerId = session.user.id;

    const existingProfile = await prisma.workerProfile.findUnique({
      where: {
        userId: workerId,
      },
    });

    const uploadDirectory = path.join(
      process.cwd(),
      "uploads",
      "resumes"
    );

    await mkdir(uploadDirectory, { recursive: true });

    const fileId = crypto.randomUUID();
    const storedFileName = `${workerId}-${fileId}${extension}`;
    const filePath = path.join(uploadDirectory, storedFileName);

    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);

    /*
     * Remove the worker's previous resume after
     * the new file has been successfully written.
     */
    if (existingProfile?.resumeUrl) {
      const previousFileName = path.basename(existingProfile.resumeUrl);

      if (previousFileName) {
        const previousPath = path.join(
          uploadDirectory,
          previousFileName
        );

        try {
          await unlink(previousPath);
        } catch {
          // Previous file may already have been removed.
        }
      }
    }

    const profile = await prisma.workerProfile.upsert({
      where: {
        userId: workerId,
      },
      create: {
        userId: workerId,
        resumeUrl: storedFileName,
        resumeName: file.name,
      },
      update: {
        resumeUrl: storedFileName,
        resumeName: file.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully.",
      resume: {
        name: profile.resumeName,
        fileId: profile.resumeUrl,
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return NextResponse.json(
      { error: "Unable to upload your resume." },
      { status: 500 }
    );
  }
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
        { error: "Only workers can access this resume." },
        { status: 403 }
      );
    }

    const profile = await prisma.workerProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!profile?.resumeUrl || !profile.resumeName) {
      return NextResponse.json(
        { error: "No resume has been uploaded." },
        { status: 404 }
      );
    }

    const fileName = path.basename(profile.resumeUrl);

    const filePath = path.join(
      process.cwd(),
      "uploads",
      "resumes",
      fileName
    );

    const { readFile } = await import("fs/promises");

    let fileBuffer: Buffer;

    try {
      fileBuffer = await readFile(filePath);
    } catch {
      return NextResponse.json(
        { error: "Resume file could not be found." },
        { status: 404 }
      );
    }

    const extension = path.extname(fileName).toLowerCase();

    const contentTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
     return new Response(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type":
          contentTypes[extension] ||
          "application/octet-stream",
        "Content-Disposition": `attachment; filename="${profile.resumeName.replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Resume download error:", error);

    return NextResponse.json(
      { error: "Unable to download your resume." },
      { status: 500 }
    );
  }
}
