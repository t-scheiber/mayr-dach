import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/projects — public: returns active projects; admin: returns all
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAdmin = !!session;
  const showAll = isAdmin && request.nextUrl.searchParams.get("all") === "true";

  const projects = await prisma.project.findMany({
    where: showAll ? {} : { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ projects });
}

// POST /api/projects — admin only
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        slug: body.slug,
        active: body.active ?? true,
        featured: body.featured ?? false,
        sortOrder: body.sortOrder ?? 0,
        name: body.name,
        location: body.location || null,
        websiteUrl: body.websiteUrl || null,
        categories: body.categories || [],
        images: body.images || [],
        attribution: body.attribution || null,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
