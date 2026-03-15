import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/jobs — public: returns active jobs; admin (with session): returns all jobs
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAdmin = !!session;
  const showAll = isAdmin && request.nextUrl.searchParams.get("all") === "true";

  const jobs = await prisma.job.findMany({
    where: showAll ? {} : { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ jobs });
}

// POST /api/jobs — admin only: create a new job
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const job = await prisma.job.create({
      data: {
        slug: body.slug,
        active: body.active ?? true,
        isApprenticeship: body.isApprenticeship ?? false,
        sortOrder: body.sortOrder ?? 0,
        titleDe: body.titleDe,
        titleEn: body.titleEn || null,
        durationDe: body.durationDe || null,
        durationEn: body.durationEn || null,
        tasksDe: body.tasksDe || [],
        tasksEn: body.tasksEn || [],
        requirementsDe: body.requirementsDe || [],
        requirementsEn: body.requirementsEn || [],
        benefitsDe: body.benefitsDe || [],
        benefitsEn: body.benefitsEn || [],
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Job creation error:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
