/**
 * Seed existing projects from JSON into the database.
 *
 * Usage:
 *   npx tsx scripts/seed-projects.ts
 */

import "dotenv/config";
import { prisma } from "../lib/db";
import projectsData from "../content/projects.json";

async function main() {
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < projectsData.projects.length; i++) {
    const p = projectsData.projects[i];

    const existing = await prisma.project.findUnique({
      where: { slug: p.id },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.project.create({
      data: {
        slug: p.id,
        name: p.name,
        location: p.location || null,
        categories: p.categories,
        featured: p.featured ?? false,
        attribution: p.attribution || null,
        images: p.images,
        sortOrder: i,
        active: true,
      },
    });

    created++;
  }

  console.log(`Seeded ${created} projects (${skipped} already existed).`);
  process.exit(0);
}

main();
