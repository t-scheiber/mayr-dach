import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/jobs/[id] — admin only
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ job });
}

// PATCH /api/jobs/[id] — admin only
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const job = await prisma.job.update({
      where: { id },
      data: {
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.isApprenticeship !== undefined && { isApprenticeship: body.isApprenticeship }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.titleDe !== undefined && { titleDe: body.titleDe }),
        ...(body.titleEn !== undefined && { titleEn: body.titleEn }),
        ...(body.durationDe !== undefined && { durationDe: body.durationDe }),
        ...(body.durationEn !== undefined && { durationEn: body.durationEn }),
        ...(body.tasksDe !== undefined && { tasksDe: body.tasksDe }),
        ...(body.tasksEn !== undefined && { tasksEn: body.tasksEn }),
        ...(body.requirementsDe !== undefined && { requirementsDe: body.requirementsDe }),
        ...(body.requirementsEn !== undefined && { requirementsEn: body.requirementsEn }),
        ...(body.benefitsDe !== undefined && { benefitsDe: body.benefitsDe }),
        ...(body.benefitsEn !== undefined && { benefitsEn: body.benefitsEn }),
      },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Job update error:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] — admin only
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Job deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
