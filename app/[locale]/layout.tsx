import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter, Great_Vibes } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BlueprintTransition } from "@/components/animations";
import { NavigationProgress } from "@/components/NavigationProgress";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mayr-dach.at";

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
      canonical: locale === "de" ? "/" : `/${locale}`,
      languages: {
        de: "/",
        en: "/en",
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

  return (
    <html lang={locale} className={`${inter.variable} ${greatVibes.variable}`}>
      <body className="font-sans antialiased overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <NavigationProgress />
          <Header />
          <main>
            <BlueprintTransition>
              {children}
            </BlueprintTransition>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
