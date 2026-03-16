import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import company from "@/content/company.json";
import { prisma } from "@/lib/db";
import ProjectCarousel from "@/components/ProjectCarousel";
import HeroVideoBackground from "@/components/HeroVideoBackground";
import { RoofTileLoader, TileFlip, GlassShimmer } from "@/components/animations";
import HeroSlogan from "@/components/HeroSlogan";
import { JsonLd } from "@/components/JsonLd";
import {
  Home,
  Wrench,
  AppWindow,
  Building,
  Droplets,
  Leaf,
  Award,
  Users,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const projects = await prisma.project.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const services = [
    { key: "roofing", href: "/leistungen/dachdeckerei", icon: Home },
    { key: "metalwork", href: "/leistungen/spenglerei", icon: Wrench },
    { key: "glazing", href: "/leistungen/glaserei", icon: AppWindow },
    { key: "facade", href: "/leistungen/fassade", icon: Building },
    { key: "sealing", href: "/leistungen/abdichtungsarbeiten", icon: Droplets },
    { key: "greenRoofs", href: "/leistungen/gruendaecher", icon: Leaf },
  ] as const;

  return (
    <>
      <RoofTileLoader size="md" />
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white overflow-hidden flex items-end min-h-[80vh] pb-16 md:pb-24">
        <HeroVideoBackground />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="relative w-full px-4 sm:px-8 md:px-16 lg:px-24 z-10 text-center">
          <HeroSlogan text={t("hero.slogan")} delay={3000} charSpeed={120} />
        </div>
      </section>

      {/* Intro Section */}
      <section className="relative py-12 sm:py-20 md:py-28 bg-gray-900 text-white text-center overflow-hidden">
        <Image
          src="/images/hero/home-hero.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-gray-900/40"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 z-10">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6">
            {t("hero.title")}
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-gray-200 font-light mb-3 sm:mb-4 leading-relaxed">
            {t("hero.description")}
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${company.company.phone}`}
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-light text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {t("hero.cta")}: {company.company.phone}
            </a>
            <Link
              href="/leistungen"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:-translate-y-1"
            >
              {t("services.title")}
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              {t("values.title")}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {(["expertise", "team", "quality"] as const).map((value) => {
              const Icon = value === "expertise" ? Award : value === "team" ? Users : CheckCircle;
              return (
                <div key={value} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {t(`values.${value}.title`)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(`values.${value}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              {t("services.title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("services.subtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <TileFlip key={service.key}>
                  <Link
                    href={service.href}
                    className="group block p-6 sm:p-8 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 h-full"
                  >
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">
                      {t(`services.${service.key}.title`)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      {t(`services.${service.key}.shortDescription`)}
                    </p>
                    <span className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      {t("services.learnMore")} <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </Link>
                </TileFlip>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 sm:py-20 md:py-28 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("projects.title")}
            </h2>
            <p className="text-lg text-gray-400">
              {t("projects.subtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {projects.map((project) => (
                <ProjectCarousel
                  key={project.id}
                  name={project.name}
                  location={project.location ?? undefined}
                  images={project.images}
                  attribution={project.attribution ?? undefined}
                  websiteUrl={project.websiteUrl ?? undefined}
                />
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-12 sm:py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero/about-hero.jpg"
                alt={t("about.title")}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl"></div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6">
                {t("about.title")}
              </h2>
              <p className="text-lg sm:text-xl text-primary font-medium mb-4 sm:mb-6">
                {t("about.experienceTitle")}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {t("about.experienceText")}
              </p>
              <Link
                href="/ueber-uns"
                className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {t("common.learnMore")} — {t("about.title")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-12 sm:py-20 md:py-28 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-primary-dark opacity-90"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center z-10">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
            {t("contact.ctaTitle")}
          </h2>
          <p className="text-base sm:text-xl mb-8 sm:mb-12 opacity-90 max-w-2xl mx-auto font-light">
            {t("contact.ctaDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlassShimmer intensity="bold">
              <a
                href={`tel:${company.company.phone}`}
                className="inline-flex items-center justify-center w-full bg-white text-primary font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300"
              >
                {company.company.phone}
              </a>
            </GlassShimmer>
            <GlassShimmer intensity="subtle">
              <a
                href={`mailto:${company.company.email}`}
                className="inline-flex items-center justify-center w-full bg-transparent border-2 border-white/80 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                {company.company.email}
              </a>
            </GlassShimmer>
          </div>
        </div>
      </section>

      {/* FAQ Schema for LLMs and Google Rich Results */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: t("faq.q1"),
            acceptedAnswer: { "@type": "Answer", text: t("faq.a1") },
          },
          {
            "@type": "Question",
            name: t("faq.q2"),
            acceptedAnswer: { "@type": "Answer", text: t("faq.a2") },
          },
          {
            "@type": "Question",
            name: t("faq.q3"),
            acceptedAnswer: { "@type": "Answer", text: t("faq.a3") },
          },
          {
            "@type": "Question",
            name: t("faq.q4"),
            acceptedAnswer: { "@type": "Answer", text: t("faq.a4") },
          },
          {
            "@type": "Question",
            name: t("faq.q5"),
            acceptedAnswer: { "@type": "Answer", text: t("faq.a5") },
          },
        ],
      }} />
    </>
  );
}
