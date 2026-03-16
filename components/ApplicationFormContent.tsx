"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface JobOption {
  slug: string;
  titleDe: string;
  titleEn: string | null;
}

export default function ApplicationFormContent() {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("applicationForm");
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const { data } = useSWR("/api/jobs", fetcher);
  const jobOptions: JobOption[] = data?.jobs || [];

  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-select position when jobs load and jobId is present
  useEffect(() => {
    if (jobId && jobOptions.length > 0 && !position) {
      const match = jobOptions.find((j) => j.slug === jobId);
      if (match) {
        setPosition((locale === "en" && match.titleEn) ? match.titleEn : match.titleDe);
      }
    }
  }, [jobId, jobOptions, locale, position]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const cv = formData.get("cv") as File;
    const motivation = formData.get("motivation") as File;

    if (cv.size > MAX_FILE_SIZE || (motivation && motivation.size > MAX_FILE_SIZE)) {
      setErrorMsg(t("fileTooLarge"));
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
        const key = data.error;
        setErrorMsg(t.has(`errors.${key}`) ? t(`errors.${key}`) : t("error"));
        setStatus("error");
      }
    } catch {
      setErrorMsg(t("error"));
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-lg font-semibold text-green-800">{t("success")}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
      <p className="text-gray-600 mb-6">{t("subtitle")}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="app-name" className="block text-sm font-medium mb-1">{t("name")} *</label>
            <input type="text" id="app-name" name="name" required placeholder={t("namePlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
          <div>
            <label htmlFor="app-phone" className="block text-sm font-medium mb-1">{t("phone")} *</label>
            <input type="tel" id="app-phone" name="phone" required placeholder={t("phonePlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="app-email" className="block text-sm font-medium mb-1">{t("email")} *</label>
            <input type="email" id="app-email" name="email" required placeholder={t("emailPlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
          <div>
            <label htmlFor="app-position" className="block text-sm font-medium mb-1">{t("position")}</label>
            <select id="app-position" name="position" value={position} onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
              <option value="">—</option>
              {jobOptions.map((job) => {
                const title = (locale === "en" && job.titleEn) ? job.titleEn : job.titleDe;
                return (
                  <option key={job.slug} value={title}>{title}</option>
                );
              })}
              <option value={t("positionOther")}>{t("positionOther")}</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="app-cv" className="block text-sm font-medium mb-1">
              {t("cv")} * <span className="text-xs text-gray-500">({t("cvRequired")})</span>
            </label>
            <input type="file" id="app-cv" name="cv" required accept=".pdf,.doc,.docx"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-light file:cursor-pointer" />
          </div>
          <div>
            <label htmlFor="app-motivation" className="block text-sm font-medium mb-1">
              {t("motivation")} <span className="text-xs text-gray-500">({t("motivationOptional")})</span>
            </label>
            <input type="file" id="app-motivation" name="motivation" accept=".pdf,.doc,.docx"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 file:cursor-pointer" />
          </div>
        </div>

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{errorMsg}</div>
        )}

        <p className="text-xs text-gray-500">{t("privacy")}</p>

        <button type="submit" disabled={status === "submitting"}
          className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {status === "submitting" ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}
