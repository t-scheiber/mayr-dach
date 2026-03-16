import { getTranslations, setRequestLocale } from "next-intl/server";
import company from "@/content/company.json";
import { ScrollReveal } from "@/components/animations";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const { address, phone, fax, email } = company.company;

  return (
    <>
      <section className="bg-dark text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <ScrollReveal direction="left">
              <h2 className="text-xl font-bold mb-6">{company.company.name}</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-500 text-sm uppercase mb-1">
                    {t("contact.address")}
                  </h3>
                  <p>
                    {address.street}
                    <br />
                    {address.zip} {address.city}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-500 text-sm uppercase mb-1">
                    {t("contact.phone")}
                  </h3>
                  <a href={`tel:${phone}`} className="text-primary hover:underline">
                    {phone}
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-500 text-sm uppercase mb-1">
                    {t("contact.fax")}
                  </h3>
                  <p>{fax}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-500 text-sm uppercase mb-1">
                    {t("contact.email")}
                  </h3>
                  <a href={`mailto:${email}`} className="text-primary hover:underline">
                    {email}
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-500 text-sm uppercase mb-1">
                    {t("contact.hours")}
                  </h3>
                  <p>{t("contact.hoursWeekday")}</p>
                  <p>{t("contact.hoursWeekend")}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal direction="right" delay={0.15}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
