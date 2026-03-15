import { getTranslations, setRequestLocale } from "next-intl/server";
import company from "@/content/company.json";

export default async function PrivacyPage({
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
          <h1 className="text-3xl md:text-5xl font-bold">
            {t("nav.privacy")}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-lg">
          <h2>
            {locale === "de"
              ? "Datenschutzerklärung"
              : "Privacy Policy"}
          </h2>

          <h3>
            {locale === "de"
              ? "1. Verantwortlicher"
              : "1. Data Controller"}
          </h3>
          <p>
            {company.company.name}
            <br />
            {company.company.address.street}
            <br />
            {company.company.address.zip} {company.company.address.city}
            <br />
            {t("contact.phone")}: {company.company.phone}
            <br />
            {t("contact.email")}: {company.company.email}
          </p>

          <h3>
            {locale === "de"
              ? "2. Arten der verarbeiteten Daten"
              : "2. Types of Data Processed"}
          </h3>
          <p>
            {locale === "de"
              ? "Personenbezogene Daten, die freiwillig bereitgestellt werden (Name, Telefon, E-Mail über Kontaktformulare). Automatisch erfasste Daten umfassen Geräte- und Nutzungsinformationen (IP-Adresse, Browsertyp, Betriebssystem)."
              : "Personal data provided voluntarily (name, phone, email via contact forms). Automatically collected data includes device and usage information (IP address, browser type, operating system)."}
          </p>

          <h3>
            {locale === "de"
              ? "3. Verarbeitungszwecke"
              : "3. Processing Purposes"}
          </h3>
          <ul>
            <li>
              {locale === "de"
                ? "Bereitstellung und Optimierung der Website"
                : "Website provision and optimization"}
            </li>
            <li>
              {locale === "de"
                ? "Erbringung von Dienstleistungen und Kundenbetreuung"
                : "Service delivery and customer care"}
            </li>
            <li>
              {locale === "de"
                ? "Beantwortung von Anfragen"
                : "Responding to inquiries"}
            </li>
            <li>
              {locale === "de"
                ? "Sicherheitsmaßnahmen"
                : "Security measures"}
            </li>
            <li>
              {locale === "de"
                ? "Erfüllung rechtlicher Verpflichtungen"
                : "Legal obligation fulfillment"}
            </li>
          </ul>

          <h3>
            {locale === "de"
              ? "4. Rechtsgrundlagen"
              : "4. Legal Bases"}
          </h3>
          <p>
            {locale === "de"
              ? "Die Verarbeitung erfolgt auf Grundlage von: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), rechtliche Verpflichtungen (Art. 6 Abs. 1 lit. c DSGVO), berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO)."
              : "Processing relies on: Consent (Article 6(1)(a) GDPR), Contract performance (Article 6(1)(b) GDPR), Legal obligations (Article 6(1)(c) GDPR), Legitimate interests (Article 6(1)(f) GDPR)."}
          </p>

          <h3>
            {locale === "de"
              ? "5. Ihre Rechte"
              : "5. Your Rights"}
          </h3>
          <ul>
            <li>
              {locale === "de" ? "Auskunftsrecht (Art. 15 DSGVO)" : "Right of access (Article 15 GDPR)"}
            </li>
            <li>
              {locale === "de" ? "Berichtigungsrecht (Art. 16 DSGVO)" : "Right to rectification (Article 16 GDPR)"}
            </li>
            <li>
              {locale === "de" ? "Löschungsrecht (Art. 17 DSGVO)" : "Right to erasure (Article 17 GDPR)"}
            </li>
            <li>
              {locale === "de" ? "Recht auf Einschränkung (Art. 18 DSGVO)" : "Right to restriction (Article 18 GDPR)"}
            </li>
            <li>
              {locale === "de" ? "Datenübertragbarkeit (Art. 20 DSGVO)" : "Right to data portability (Article 20 GDPR)"}
            </li>
            <li>
              {locale === "de" ? "Widerspruchsrecht (Art. 21 DSGVO)" : "Right to object (Article 21 GDPR)"}
            </li>
          </ul>

          <p className="text-sm text-gray-500 mt-8">
            {locale === "de"
              ? "Letzte Aktualisierung: Oktober 2025"
              : "Last updated: October 2025"}
          </p>
        </div>
      </section>
    </>
  );
}
