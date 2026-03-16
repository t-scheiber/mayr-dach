import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter, Great_Vibes } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BlueprintTransition } from "@/components/animations";
import { NavigationProgress } from "@/components/NavigationProgress";
import { MotionProvider } from "@/components/MotionProvider";
import { JsonLd } from "@/components/JsonLd";
import company from "@/content/company.json";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mayr-dach.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: {
      default: t("metadata.title"),
      template: `%s | Karl Mayr GmbH & Co. KG`,
    },
    description: t("metadata.description"),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: locale === "de" ? BASE_URL : `${BASE_URL}/${locale}`,
      languages: {
        de: BASE_URL,
        en: `${BASE_URL}/en`,
        "x-default": BASE_URL,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "de" ? "de_AT" : "en_US",
      siteName: "Karl Mayr GmbH & Co. KG",
      title: t("metadata.title"),
      description: t("metadata.description"),
      url: locale === "de" ? "/" : `/${locale}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-script" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale });

  const { company: c } = company;
  const isEn = locale === "en";

  const localBusinessJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "RoofingContractor"],
    "@id": `${BASE_URL}/#organization`,
    name: c.name,
    description: t("metadata.description"),
    url: BASE_URL,
    telephone: c.phone,
    email: c.email,
    foundingDate: String(c.founded),
    image: `${BASE_URL}/images/logo/logo.png`,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/images/logo/logo.png`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: c.address.street,
      addressLocality: c.address.city,
      postalCode: c.address.zip,
      addressCountry: c.address.country,
      addressRegion: "Salzburg",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: c.coordinates.lat,
      longitude: c.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "12:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "13:00",
        closes: "17:00",
      },
    ],
    areaServed: [
      {
        "@type": "City",
        name: "Saalfelden am Steinernen Meer",
      },
      {
        "@type": "AdministrativeArea",
        name: "Pinzgau",
      },
      {
        "@type": "State",
        name: "Salzburg",
      },
    ],
    priceRange: "$$",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: c.stats.employees,
    },
    knowsAbout: isEn
      ? ["Roofing", "Metalwork", "Glazing", "Facade Construction", "Sealing", "Green Roofs"]
      : ["Dachdeckerei", "Spenglerei", "Glaserei", "Fassadenbau", "Abdichtungsarbeiten", "Gründächer"],
    slogan: isEn
      ? "Finally a proper roof!"
      : "Endlich ein richtiges Dach!",
  };

  return (
    <html lang={locale} className={`${inter.variable} ${greatVibes.variable}`}>
      <head>
        <link rel="preload" href="/images/hero/video-poster.jpg" as="image" />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        <JsonLd data={localBusinessJsonLd} />
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
            <NavigationProgress />
            <Header />
            <main>
              <BlueprintTransition>
                {children}
              </BlueprintTransition>
            </main>
            <Footer />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
