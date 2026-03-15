import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import ApplicationForm from "@/components/ApplicationForm";
import { Suspense } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations";

export const dynamic = "force-dynamic";

function asStrings(val: unknown): string[] {
  return Array.isArray(val) ? val : [];
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

  return (
    <>
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
                {isEn
                  ? "No open positions at the moment. Check back soon!"
                  : "Derzeit keine offenen Stellen. Schauen Sie bald wieder vorbei!"}
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

                    {(() => {
                      const tasks = isEn && asStrings(job.tasksEn).length > 0 ? asStrings(job.tasksEn) : asStrings(job.tasksDe);
                      return tasks.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm text-gray-500 uppercase mb-2">
                            {isEn ? "Tasks" : "Aufgaben"}
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                            {tasks.map((task, i) => (
                              <li key={i}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })()}

                    {(() => {
                      const reqs = isEn && asStrings(job.requirementsEn).length > 0 ? asStrings(job.requirementsEn) : asStrings(job.requirementsDe);
                      return reqs.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm text-gray-500 uppercase mb-2">
                            {isEn ? "Requirements" : "Anforderungen"}
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                            {reqs.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })()}

                    {(() => {
                      const benefits = isEn && asStrings(job.benefitsEn).length > 0 ? asStrings(job.benefitsEn) : asStrings(job.benefitsDe);
                      return benefits.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-sm text-gray-500 uppercase mb-2">
                            {isEn ? "We offer" : "Wir bieten"}
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                            {benefits.map((benefit, i) => (
                              <li key={i}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })()}

                    <a
                      href={`?jobId=${job.slug}#bewerbung`}
                      className="inline-block bg-primary hover:bg-primary-light text-white font-semibold py-2 px-6 rounded transition-colors text-sm"
                    >
                      {isEn ? "Apply Now" : "Jetzt bewerben"} →
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
          <Suspense fallback={<div>Laden...</div>}>
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
          <StaggerContainer staggerDelay={0.12} className="grid md:grid-cols-3 gap-8">
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
