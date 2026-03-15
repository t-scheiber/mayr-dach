import { getTranslations, setRequestLocale } from "next-intl/server";
import company from "@/content/company.json";

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const { legal, address, phone, fax, email } = company.company;

  return (
    <>
      <section className="bg-dark text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-5xl font-bold">
            {t("nav.impressum")}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-lg">
          <h2>{company.company.name}</h2>
          <p>
            {address.street}
            <br />
            {address.zip} {address.city}, {address.country === "AT" ? "Austria" : address.country}
          </p>

          <p>
            {t("contact.phone")}: <a href={`tel:${phone}`}>{phone}</a>
            <br />
            {t("contact.fax")}: {fax}
            <br />
            {t("contact.email")}: <a href={`mailto:${email}`}>{email}</a>
          </p>

          <h3>
            {locale === "de" ? "Unternehmensdetails" : "Company Details"}
          </h3>
          <ul className="list-none pl-0 space-y-1 text-sm">
            <li>
              <strong>UID:</strong> {legal.uid}
            </li>
            <li>
              <strong>{locale === "de" ? "Rechtsform" : "Legal Form"}:</strong>{" "}
              {legal.legalForm}
            </li>
            <li>
              <strong>
                {locale === "de" ? "Geschäftsführung" : "Management"}:
              </strong>{" "}
              {legal.management}
            </li>
            <li>
              <strong>
                {locale === "de" ? "Firmenbuchnummer" : "Register Number"}:
              </strong>{" "}
              {legal.registerNumber}
            </li>
            <li>
              <strong>
                {locale === "de" ? "Firmenbuchgericht" : "Commercial Court"}:
              </strong>{" "}
              {legal.court}
            </li>
            <li>
              <strong>
                {locale === "de" ? "Gewerbe" : "Trade"}:
              </strong>{" "}
              {legal.trade}
            </li>
            <li>
              <strong>
                {locale === "de" ? "Berufsverband" : "Professional Association"}:
              </strong>{" "}
              {legal.association}
            </li>
            <li>
              <strong>
                {locale === "de" ? "Aufsichtsbehörde" : "Supervisory Authority"}:
              </strong>{" "}
              {legal.authority}
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
