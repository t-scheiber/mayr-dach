import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import ApplicationForm from "@/components/ApplicationForm";
import { Suspense } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations";
import { JsonLd } from "@/components/JsonLd";
import company from "@/content/company.json";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mayr-dach.at";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
    },
  };
}

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const jobs = await prisma.job.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const isEn = locale === "en";

  const { company: c } = company;

  const jobPostingJsonLdItems = jobs.map((job) => {
    const title = (isEn && job.titleEn) || job.titleDe;
    const description = [
      ...(isEn && job.tasksEn.length > 0 ? job.tasksEn : job.tasksDe),
      ...(isEn && job.requirementsEn.length > 0 ? job.requirementsEn : job.requirementsDe),
    ].join(". ");

    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title,
      description: description || title,
      datePosted: job.createdAt.toISOString().split("T")[0],
      hiringOrganization: {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: c.name,
        sameAs: BASE_URL,
        logo: `${BASE_URL}/images/logo/logo.png`,
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          streetAddress: c.address.street,
          addressLocality: c.address.city,
          postalCode: c.address.zip,
          addressCountry: c.address.country,
          addressRegion: "Salzburg",
        },
      },
      employmentType: job.isApprenticeship ? "INTERN" : "FULL_TIME",
    };

    if (job.isApprenticeship) {
      jsonLd.occupationalCategory = "Apprenticeship";
    }

    return jsonLd;
  });

  return (
    <>
      {jobPostingJsonLdItems.map((jsonLd, index) => (
        <JsonLd key={index} data={jsonLd} />
      ))}
      <section className="bg-dark text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("jobs.title")}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            {t("jobs.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-8">{t("jobs.workingTitle")}</h2>
          <p className="text-gray-600 mb-12">{t("jobs.workingText")}</p>

          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {t("jobs.noPositions")}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {jobs.map((job, index) => (
                <ScrollReveal key={job.id} direction="up" delay={index * 0.1}>
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold mb-4">
                      {(isEn && job.titleEn) || job.titleDe}
                    </h3>

                    {job.isApprenticeship && job.durationDe && (
                      <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                        {(isEn && job.durationEn) || job.durationDe}
                      </span>
                    )}

                    {(isEn && job.tasksEn.length > 0 ? job.tasksEn : job.tasksDe).length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-gray-500 uppercase mb-2">
                          {t("jobs.tasks")}
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                          {(isEn && job.tasksEn.length > 0 ? job.tasksEn : job.tasksDe).map((task) => (
                            <li key={task}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(isEn && job.requirementsEn.length > 0 ? job.requirementsEn : job.requirementsDe).length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-gray-500 uppercase mb-2">
                          {t("jobs.requirements")}
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                          {(isEn && job.requirementsEn.length > 0 ? job.requirementsEn : job.requirementsDe).map((req) => (
                            <li key={req}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(isEn && job.benefitsEn.length > 0 ? job.benefitsEn : job.benefitsDe).length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-sm text-gray-500 uppercase mb-2">
                          {t("jobs.benefits")}
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                          {(isEn && job.benefitsEn.length > 0 ? job.benefitsEn : job.benefitsDe).map((benefit) => (
                            <li key={benefit}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <a
                      href={`?jobId=${job.slug}#bewerbung`}
                      className="inline-block bg-primary hover:bg-primary-light text-white font-semibold py-2 px-6 rounded transition-colors text-sm"
                    >
                      {t("jobs.applyNow")} →
                    </a>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Form */}
      <section id="bewerbung" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Suspense fallback={<div>{t("common.loading")}</div>}>
            <ApplicationForm />
          </Suspense>
        </div>
      </section>

      {/* Employer Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            {t("jobs.employerTitle")}
          </h2>
          <StaggerContainer staggerDelay={0.12} className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {(["development", "teamSpirit", "qualityWork"] as const).map(
              (item) => (
                <StaggerItem key={item}>
                  <div className="text-center p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {t(`jobs.${item}.title`)}
                    </h3>
                    <p className="text-gray-600">
                      {t(`jobs.${item}.description`)}
                    </p>
                  </div>
                </StaggerItem>
              )
            )}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
