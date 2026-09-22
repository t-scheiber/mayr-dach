import projectsData from "@/content/projects.json";
import jobsData from "@/content/jobs.json";

export async function getProjects() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return projectsData.projects.map((p) => ({
      ...p, location: p.location ?? null, websiteUrl: "websiteUrl" in p && typeof p.websiteUrl === "string" ? p.websiteUrl : null,
      attribution: "attribution" in p ? p.attribution : null,
    }));
  }
  const { connection } = await import("next/server");
  await connection();
  const { prisma } = await import("./db");
  return prisma.project.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
}

export async function getJobs() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return jobsData.jobs.map((j) => ({
      id: j.id, slug: j.id, titleDe: j.title.de, titleEn: j.title.en,
      tasksDe: j.tasks.de, tasksEn: j.tasks.en,
      requirementsDe: j.requirements.de, requirementsEn: j.requirements.en,
      benefitsDe: j.benefits.de, benefitsEn: j.benefits.en,
      isApprenticeship: "duration" in j,
      durationDe: "duration" in j ? j.duration?.de ?? null : null,
      durationEn: "duration" in j ? j.duration?.en ?? null : null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
    }));
  }
  const { connection } = await import("next/server");
  await connection();
  const { prisma } = await import("./db");
  return prisma.job.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
}
