import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; filename: string }> }
) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, filename } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Determine which file to serve
  let filePath: string | null = null;
  let originalFilename: string | null = null;

  if (filename === "cv" && application.cvPath) {
    filePath = application.cvPath;
    originalFilename = application.cvFilename;
  } else if (filename === "motivation" && application.motivationPath) {
    filePath = application.motivationPath;
    originalFilename = application.motivationFilename;
  }

  if (!filePath || !originalFilename) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    const ext = originalFilename.split(".").pop()?.toLowerCase();
    const contentType =
      ext === "pdf"
        ? "application/pdf"
        : ext === "doc"
          ? "application/msword"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${originalFilename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
