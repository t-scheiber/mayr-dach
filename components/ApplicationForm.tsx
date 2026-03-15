"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

const labels = {
  de: {
    title: "Jetzt bewerben",
    subtitle: "Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden.",
    name: "Name",
    namePlaceholder: "Vor- und Nachname",
    email: "E-Mail",
    emailPlaceholder: "ihre@email.at",
    phone: "Telefonnummer",
    phonePlaceholder: "+43 ...",
    position: "Gewünschte Position",
    positionOther: "Sonstiges",
    cv: "Lebenslauf (PDF/Word)",
    cvRequired: "Pflichtfeld",
    motivation: "Motivationsschreiben (optional)",
    motivationOptional: "PDF/Word",
    submit: "Bewerbung absenden",
    submitting: "Wird gesendet...",
    success: "Ihre Bewerbung wurde erfolgreich übermittelt! Wir melden uns in Kürze bei Ihnen.",
    error: "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    fileTooLarge: "Datei darf maximal 10 MB groß sein.",
    privacy: "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer Datenschutzerklärung zu.",
  },
  en: {
    title: "Apply Now",
    subtitle: "Fill out the form and we'll get back to you within 24 hours.",
    name: "Name",
    namePlaceholder: "First and last name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    phone: "Phone Number",
    phonePlaceholder: "+43 ...",
    position: "Desired Position",
    positionOther: "Other",
    cv: "CV (PDF/Word)",
    cvRequired: "Required",
    motivation: "Cover Letter (optional)",
    motivationOptional: "PDF/Word",
    submit: "Submit Application",
    submitting: "Submitting...",
    success: "Your application has been submitted successfully! We'll get back to you shortly.",
    error: "An error occurred while submitting. Please try again.",
    fileTooLarge: "File must be 10 MB or less.",
    privacy: "By submitting, you agree to the processing of your data in accordance with our privacy policy.",
  },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface JobOption {
  slug: string;
  titleDe: string;
  titleEn: string | null;
}

export default function ApplicationForm() {
  const locale = useLocale() as "de" | "en";
  const t = labels[locale];
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [jobOptions, setJobOptions] = useState<JobOption[]>([]);
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch active jobs for the position dropdown
  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        const jobs: JobOption[] = data.jobs || [];
        setJobOptions(jobs);

        // Pre-select if jobId matches a slug
        if (jobId) {
          const match = jobs.find((j) => j.slug === jobId);
          if (match) {
            setPosition((locale === "en" && match.titleEn) ? match.titleEn : match.titleDe);
          }
        }
      })
      .catch(() => {});
  }, [jobId, locale]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const cv = formData.get("cv") as File;
    const motivation = formData.get("motivation") as File;

    if (cv.size > MAX_FILE_SIZE || (motivation && motivation.size > MAX_FILE_SIZE)) {
      setErrorMsg(t.fileTooLarge);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/applications", { method: "POST", body: formData });
      if (res.ok) {
        setStatus("success");
        setPosition("");
        form.reset();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || t.error);
        setStatus("error");
      }
    } catch {
      setErrorMsg(t.error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-lg font-semibold text-green-800">{t.success}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
      <p className="text-gray-600 mb-6">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="app-name" className="block text-sm font-medium mb-1">{t.name} *</label>
            <input type="text" id="app-name" name="name" required placeholder={t.namePlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
          <div>
            <label htmlFor="app-phone" className="block text-sm font-medium mb-1">{t.phone} *</label>
            <input type="tel" id="app-phone" name="phone" required placeholder={t.phonePlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="app-email" className="block text-sm font-medium mb-1">{t.email} *</label>
            <input type="email" id="app-email" name="email" required placeholder={t.emailPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
          <div>
            <label htmlFor="app-position" className="block text-sm font-medium mb-1">{t.position}</label>
            <select id="app-position" name="position" value={position} onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
              <option value="">—</option>
              {jobOptions.map((job) => {
                const title = (locale === "en" && job.titleEn) ? job.titleEn : job.titleDe;
                return (
                  <option key={job.slug} value={title}>{title}</option>
                );
              })}
              <option value={t.positionOther}>{t.positionOther}</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="app-cv" className="block text-sm font-medium mb-1">
              {t.cv} * <span className="text-xs text-gray-500">({t.cvRequired})</span>
            </label>
            <input type="file" id="app-cv" name="cv" required accept=".pdf,.doc,.docx"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-light file:cursor-pointer" />
          </div>
          <div>
            <label htmlFor="app-motivation" className="block text-sm font-medium mb-1">
              {t.motivation} <span className="text-xs text-gray-500">({t.motivationOptional})</span>
            </label>
            <input type="file" id="app-motivation" name="motivation" accept=".pdf,.doc,.docx"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 file:cursor-pointer" />
          </div>
        </div>

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{errorMsg}</div>
        )}

        <p className="text-xs text-gray-500">{t.privacy}</p>

        <button type="submit" disabled={status === "submitting"}
          className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {status === "submitting" ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
}
