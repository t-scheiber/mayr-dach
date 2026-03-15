import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import company from "@/content/company.json";
import projectsData from "@/content/projects.json";
import ProjectCarousel from "@/components/ProjectCarousel";
import { ScrollReveal, GlassShimmer } from "@/components/animations";

const serviceMap = {
  dachdeckerei: "roofing",
  spenglerei: "metalwork",
  glaserei: "glazing",
  fassade: "facade",
  abdichtungsarbeiten: "sealing",
  gruendaecher: "greenRoofs",
} as const;

const heroImages: Record<string, string> = {
  dachdeckerei: "/images/hero/home-hero.jpg",
  spenglerei: "/images/hero/spenglerei-hero.jpg",
  glaserei: "/images/hero/glaserei-hero.jpg",
  fassade: "/images/hero/fassade-hero.jpg",
  abdichtungsarbeiten: "/images/hero/abdichtung-hero.jpg",
  gruendaecher: "/images/hero/gruendaecher-hero.jpg",
};

type ServiceSlug = keyof typeof serviceMap;

export function generateStaticParams() {
  return Object.keys(serviceMap).map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  if (!(slug in serviceMap)) {
    notFound();
  }

  const serviceKey = serviceMap[slug as ServiceSlug];

  // Get relevant projects for this service
  const relevantProjects = projectsData.projects.filter((p) =>
    p.categories.includes(serviceKey)
  );

  return (
    <>
      {/* Hero */}
      <section className="relative bg-dark text-white py-20 md:py-28 overflow-hidden">
        <Image
          src={heroImages[slug] ?? "/images/hero/home-hero.jpg"}
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-sm uppercase tracking-wider opacity-70 mb-2">
            <Link href="/leistungen" className="hover:underline">
              {t("nav.services")}
            </Link>{" "}
            / {t(`services.${serviceKey}.title`)}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t(`services.${serviceKey}.heroTitle`)}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            {t(`services.${serviceKey}.heroDescription`)}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t(`services.${serviceKey}.sectionTitle`)}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
              {t(`services.${serviceKey}.sectionText`)}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* References */}
      {relevantProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold mb-2">{t("projects.subtitle")}</h2>
            <p className="text-gray-600 mb-8">{t("projects.title")}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relevantProjects.slice(0, 9).map((project) => (
                <ProjectCarousel
                  key={project.id}
                  name={project.name}
                  location={project.location}
                  images={project.images}
                  attribution={project.attribution}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t("contact.ctaTitle")}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {t("contact.ctaDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlassShimmer intensity="bold">
              <a
                href={`tel:${company.company.phone}`}
                className="inline-flex items-center justify-center w-full bg-white text-primary font-semibold px-8 py-3 rounded hover:bg-gray-100 transition-colors"
              >
                {company.company.phone}
              </a>
            </GlassShimmer>
            <GlassShimmer intensity="subtle">
              <a
                href={`mailto:${company.company.email}`}
                className="inline-flex items-center justify-center w-full border-2 border-white text-white font-semibold px-8 py-3 rounded hover:bg-white hover:text-primary transition-colors"
              >
                {company.company.email}
              </a>
            </GlassShimmer>
          </div>
        </div>
      </section>
    </>
  );
}
