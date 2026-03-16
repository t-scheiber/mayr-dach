import { z } from "zod/v4";

const messages = {
  de: {
    nameRequired: "Bitte geben Sie Ihren Namen ein.",
    emailRequired: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
    emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    messageRequired: "Bitte geben Sie eine Nachricht ein.",
    messageMin: "Die Nachricht muss mindestens 10 Zeichen lang sein.",
    messageMax: "Die Nachricht darf maximal 5000 Zeichen lang sein.",
    serverError:
      "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
  },
  en: {
    nameRequired: "Please enter your name.",
    emailRequired: "Please enter your email address.",
    emailInvalid: "Please enter a valid email address.",
    messageRequired: "Please enter a message.",
    messageMin: "The message must be at least 10 characters long.",
    messageMax: "The message must be at most 5000 characters long.",
    serverError: "An error occurred while sending. Please try again.",
  },
} as const;

export type ContactLocale = keyof typeof messages;

export function contactSchema(locale: ContactLocale = "de") {
  const t = messages[locale];

  return z.object({
    name: z.string().min(1, t.nameRequired),
    email: z.email(t.emailInvalid).min(1, t.emailRequired),
    phone: z.string().optional(),
    message: z
      .string()
      .min(10, t.messageMin)
      .max(5000, t.messageMax),
    locale: z.enum(["de", "en"]).optional(),
  });
}

export function getContactMessages(locale: ContactLocale = "de") {
  return messages[locale];
}
