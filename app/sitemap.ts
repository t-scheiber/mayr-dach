import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mayr-dach.at";

const services = [
  "dachdeckerei",
  "spenglerei",
  "glaserei",
  "fassade",
  "abdichtungsarbeiten",
  "gruendaecher",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    "",
    "/ueber-uns",
    "/leistungen",
    "/jobs",
    "/kontakt",
    "/impressum",
    "/datenschutz",
  ];

  const entries: MetadataRoute.Sitemap = [];

  // German (default locale, no prefix)
  for (const page of staticPages) {
    entries.push({
      url: `${BASE_URL}${page}`,
      lastModified: now,
      changeFrequency: page === "" ? "weekly" : "monthly",
      priority: page === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          de: `${BASE_URL}${page}`,
          en: `${BASE_URL}/en${page}`,
        },
      },
    });
  }

  // Service detail pages
  for (const slug of services) {
    entries.push({
      url: `${BASE_URL}/leistungen/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          de: `${BASE_URL}/leistungen/${slug}`,
          en: `${BASE_URL}/en/leistungen/${slug}`,
        },
      },
    });
  }

  return entries;
}
