import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ScrollReveal, StaggerContainer, StaggerItem, TileFlip } from "@/components/animations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const services = [
    { key: "roofing", href: "/leistungen/dachdeckerei" },
    { key: "metalwork", href: "/leistungen/spenglerei" },
    { key: "glazing", href: "/leistungen/glaserei" },
    { key: "facade", href: "/leistungen/fassade" },
    { key: "sealing", href: "/leistungen/abdichtungsarbeiten" },
    { key: "greenRoofs", href: "/leistungen/gruendaecher" },
  ] as const;

  return (
    <>
      <section className="bg-dark text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("services.title")}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {t("services.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StaggerContainer staggerDelay={0.1} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {services.map((service) => (
              <StaggerItem key={service.key}>
                <TileFlip>
                  <Link
                    href={service.href}
                    className="group block p-6 sm:p-8 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary transition-all h-full"
                  >
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {t(`services.${service.key}.title`)}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {t(`services.${service.key}.shortDescription`)}
                    </p>
                    <span className="text-primary font-medium">
                      {t("services.learnMore")} →
                    </span>
                  </Link>
                </TileFlip>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
