import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/db";
import { sendApplicationNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string | null;
    const cv = formData.get("cv") as File;
    const motivation = formData.get("motivation") as File | null;

    // Validate required fields
    if (!name || !email || !phone || !cv) {
      return NextResponse.json(
        { error: "missingRequired" },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(cv.type)) {
      return NextResponse.json(
        { error: "invalidCvType" },
        { status: 400 }
      );
    }

    if (motivation && motivation.size > 0 && !allowedTypes.includes(motivation.type)) {
      return NextResponse.json(
        { error: "invalidMotivationType" },
        { status: 400 }
      );
    }

    // Create upload directory for this application
    const timestamp = Date.now();
    const uploadDir = join(process.cwd(), "uploads", `${timestamp}-${name.replace(/\s+/g, "-").toLowerCase()}`);
    await mkdir(uploadDir, { recursive: true });

    // Save CV
    const cvBuffer = Buffer.from(await cv.arrayBuffer());
    const cvFilename = `cv-${cv.name}`;
    const cvPath = join(uploadDir, cvFilename);
    await writeFile(cvPath, cvBuffer);

    // Save motivation letter if provided
    let motivationFilename: string | null = null;
    let motivationPath: string | null = null;
    if (motivation && motivation.size > 0) {
      motivationFilename = `motivation-${motivation.name}`;
      motivationPath = join(uploadDir, motivationFilename);
      const motivationBuffer = Buffer.from(await motivation.arrayBuffer());
      await writeFile(motivationPath, motivationBuffer);
    }

    // Create database record
    const application = await prisma.application.create({
      data: {
        name,
        email,
        phone,
        position,
        cvFilename,
        cvPath,
        motivationFilename,
        motivationPath,
      },
    });

    // Send email notification (non-blocking)
    sendApplicationNotification(application);

    return NextResponse.json(
      { success: true, id: application.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "submitFailed" },
      { status: 500 }
    );
  }
}
