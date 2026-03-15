import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import company from "@/content/company.json";
import projectsData from "@/content/projects.json";
import ProjectCarousel from "@/components/ProjectCarousel";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const services = [
    { key: "roofing", href: "/leistungen/dachdeckerei", icon: "🏠" },
    { key: "metalwork", href: "/leistungen/spenglerei", icon: "🔧" },
    { key: "glazing", href: "/leistungen/glaserei", icon: "🪟" },
    { key: "facade", href: "/leistungen/fassade", icon: "🏗️" },
    { key: "sealing", href: "/leistungen/abdichtungsarbeiten", icon: "💧" },
    { key: "greenRoofs", href: "/leistungen/gruendaecher", icon: "🌿" },
  ] as const;

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-dark text-white py-24 md:py-32 overflow-hidden">
        <Image
          src="/images/hero/home-hero.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl mb-4 max-w-3xl opacity-90">
            {t("hero.description")}
          </p>
          <p className="text-base md:text-lg mb-8 max-w-3xl opacity-80">
            {t("hero.subtitle")}
          </p>
          <a
            href={`tel:${company.company.phone}`}
            className="inline-block bg-primary hover:bg-primary-light text-white font-semibold px-8 py-3 rounded transition-colors"
          >
            {t("hero.cta")}: {company.company.phone}
          </a>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t("values.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(["expertise", "team", "quality"] as const).map((value) => (
              <div key={value} className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {value === "expertise" ? "F" : value === "team" ? "T" : "Q"}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t(`values.${value}.title`)}
                </h3>
                <p className="text-gray-600">
                  {t(`values.${value}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {t("services.title")}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {t("services.subtitle")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.key}
                href={service.href}
                className="group block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary transition-all"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {t(`services.${service.key}.title`)}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t(`services.${service.key}.shortDescription`)}
                </p>
                <span className="text-primary font-medium text-sm">
                  {t("services.learnMore")} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
            {t("projects.title")}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {t("projects.subtitle")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.projects.map((project) => (
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

      {/* About Preview Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-4/3 rounded-lg overflow-hidden">
              <Image
                src="/images/hero/about-hero.jpg"
                alt={t("about.title")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t("about.title")}
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                {t("about.experienceTitle")}
              </p>
              <p className="text-gray-600 mb-6">
                {t("about.experienceText")}
              </p>
              <Link
                href="/ueber-uns"
                className="inline-block text-primary font-medium hover:text-primary-light transition-colors"
              >
                {t("common.learnMore")} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t("contact.ctaTitle")}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {t("contact.ctaDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${company.company.phone}`}
              className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded hover:bg-gray-100 transition-colors"
            >
              {company.company.phone}
            </a>
            <a
              href={`mailto:${company.company.email}`}
              className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded hover:bg-white hover:text-primary transition-colors"
            >
              {company.company.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
