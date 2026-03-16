"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  contactSchema,
  getContactMessages,
  type ContactLocale,
} from "@/lib/contact-schema";

const labels = {
  de: {
    name: "Name",
    namePlaceholder: "Vor- und Nachname",
    email: "E-Mail",
    emailPlaceholder: "ihre@email.at",
    phone: "Telefon",
    phonePlaceholder: "+43 ...",
    message: "Nachricht",
    messagePlaceholder: "Wie können wir Ihnen helfen?",
    send: "Absenden",
    submitting: "Wird gesendet...",
    success:
      "Vielen Dank für Ihre Nachricht! Wir melden uns so schnell wie möglich bei Ihnen.",
    privacy:
      "Es werden personenbezogene Daten übermittelt und für die in der Datenschutzseite beschriebenen Zwecke verwendet.",
  },
  en: {
    name: "Name",
    namePlaceholder: "First and last name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    phone: "Phone",
    phonePlaceholder: "+43 ...",
    message: "Message",
    messagePlaceholder: "How can we help you?",
    send: "Send",
    submitting: "Sending...",
    success:
      "Thank you for your message! We will get back to you as soon as possible.",
    privacy:
      "Personal data will be transmitted and used for the purposes described on the privacy page.",
  },
};

const inputBase =
  "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none";

export default function ContactForm() {
  const locale = useLocale() as ContactLocale;
  const t = labels[locale];
  const msgs = getContactMessages(locale);

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setGeneralError("");
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: (formData.get("name") as string).trim(),
      email: (formData.get("email") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      message: (formData.get("message") as string).trim(),
      locale,
    };

    // Client-side validation
    const result = contactSchema(locale).safeParse(payload);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const data = await res.json();
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        } else {
          setGeneralError(data.error || msgs.serverError);
        }
        setStatus("error");
      }
    } catch {
      setGeneralError(msgs.serverError);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <p className="text-lg font-semibold text-green-800">{t.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
          {t.name} *
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          placeholder={t.namePlaceholder}
          onChange={() => clearFieldError("name")}
          className={`${inputBase} ${fieldErrors.name ? "border-red-400" : "border-gray-300"}`}
        />
        {fieldErrors.name && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium mb-1">
          {t.email} *
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          placeholder={t.emailPlaceholder}
          onChange={() => clearFieldError("email")}
          className={`${inputBase} ${fieldErrors.email ? "border-red-400" : "border-gray-300"}`}
        />
        {fieldErrors.email && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
        )}
      </div>
      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium mb-1">
          {t.phone}
        </label>
        <input
          type="tel"
          id="contact-phone"
          name="phone"
          placeholder={t.phonePlaceholder}
          className={`${inputBase} border-gray-300`}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium mb-1">
          {t.message} *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder={t.messagePlaceholder}
          onChange={() => clearFieldError("message")}
          className={`${inputBase} resize-y ${fieldErrors.message ? "border-red-400" : "border-gray-300"}`}
        />
        {fieldErrors.message && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.message}</p>
        )}
      </div>

      {generalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {generalError}
        </div>
      )}

      <p className="text-xs text-gray-500">{t.privacy}</p>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? t.submitting : t.send}
      </button>
    </form>
  );
}
