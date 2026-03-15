import { getTranslations, setRequestLocale } from "next-intl/server";
import jobs from "@/content/jobs.json";
import ApplicationForm from "@/components/ApplicationForm";

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

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

          <div className="space-y-8">
            {jobs.jobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold mb-4">
                  {job.title[locale as "de" | "en"] ?? job.title.de}
                </h3>

                {"isApprenticeship" in job && job.isApprenticeship && (
                  <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                    {job.duration[locale as "de" | "en"] ?? job.duration.de}
                  </span>
                )}

                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-500 uppercase mb-2">
                    {locale === "de" ? "Aufgaben" : "Tasks"}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {(job.tasks[locale as "de" | "en"] ?? job.tasks.de).map(
                      (task, i) => (
                        <li key={i}>{task}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-500 uppercase mb-2">
                    {locale === "de" ? "Anforderungen" : "Requirements"}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {(
                      job.requirements[locale as "de" | "en"] ??
                      job.requirements.de
                    ).map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-sm text-gray-500 uppercase mb-2">
                    {locale === "de" ? "Wir bieten" : "We offer"}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {(
                      job.benefits[locale as "de" | "en"] ?? job.benefits.de
                    ).map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#bewerbung"
                  className="inline-block bg-primary hover:bg-primary-light text-white font-semibold py-2 px-6 rounded transition-colors text-sm"
                >
                  {locale === "de" ? "Jetzt bewerben" : "Apply Now"} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="bewerbung" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ApplicationForm />
        </div>
      </section>

      {/* Employer Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            {t("jobs.employerTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(["development", "teamSpirit", "qualityWork"] as const).map(
              (item) => (
                <div key={item} className="text-center p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t(`jobs.${item}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`jobs.${item}.description`)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
