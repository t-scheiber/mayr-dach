import { getTranslations, setRequestLocale } from "next-intl/server";
import team from "@/content/team.json";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const stats = [
    { key: "masters", count: t("about.stats.mastersCount"), label: t("about.stats.masters") },
    { key: "experience", count: t("about.stats.experienceCount"), label: t("about.stats.experience") },
    { key: "employees", count: t("about.stats.employeesCount"), label: t("about.stats.employees") },
    { key: "vehicles", count: t("about.stats.vehiclesCount"), label: t("about.stats.vehicles") },
    { key: "projects", count: t("about.stats.projectsCount"), label: t("about.stats.projects") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-dark text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("about.heroTitle")}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            {t("about.heroDescription")}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {stats.map((stat) => (
              <StaggerItem key={stat.key}>
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.count}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up" className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("about.experienceTitle")}
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t("about.experienceText")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t("about.teamTitle")}
          </h2>
          <p className="text-gray-600 mb-12">
            {t("about.teamDescription")}
          </p>
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {team.team.map((member) => (
              <StaggerItem key={member.name}>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl text-gray-500">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm">{member.name}</h3>
                  {member.role && (
                    <p className="text-xs text-gray-500 mt-1">{member.role}</p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
