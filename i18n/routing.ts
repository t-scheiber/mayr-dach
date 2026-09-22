import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? "always" : "as-needed",
  localeDetection: false,
});
