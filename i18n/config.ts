export const locales = ["de", "en"] as const;
export const defaultLocale = "de" as const;

export type Locale = (typeof locales)[number];
