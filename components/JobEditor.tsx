"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface JobData {
  slug: string;
  active: boolean;
  isApprenticeship: boolean;
  sortOrder: number;
  titleDe: string;
  titleEn: string;
  durationDe: string;
  durationEn: string;
  tasksDe: string;
  tasksEn: string;
  requirementsDe: string;
  requirementsEn: string;
  benefitsDe: string;
  benefitsEn: string;
}

const emptyJob: JobData = {
  slug: "",
  active: true,
  isApprenticeship: false,
  sortOrder: 0,
  titleDe: "",
  titleEn: "",
  durationDe: "",
  durationEn: "",
  tasksDe: "",
  tasksEn: "",
  requirementsDe: "",
  requirementsEn: "",
  benefitsDe: "",
  benefitsEn: "",
};

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function JobEditor({ jobId }: { jobId?: string }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin.jobEditor");
  const tc = useTranslations("common");
  const adminBase = locale === "de" ? "" : locale + "/";

  const isNew = !jobId;
  const [form, setForm] = useState<JobData>(emptyJob);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { data, isLoading } = useSWR(
    session && jobId ? `/api/jobs/${jobId}` : null,
    fetcher
  );

  // Initialize form from fetched data
  useEffect(() => {
    if (data?.job) {
      const j = data.job;
      setForm({
        slug: j.slug,
        active: j.active,
        isApprenticeship: j.isApprenticeship,
        sortOrder: j.sortOrder,
        titleDe: j.titleDe,
        titleEn: j.titleEn || "",
        durationDe: j.durationDe || "",
        durationEn: j.durationEn || "",
        tasksDe: (j.tasksDe || []).join("\n"),
        tasksEn: (j.tasksEn || []).join("\n"),
        requirementsDe: (j.requirementsDe || []).join("\n"),
        requirementsEn: (j.requirementsEn || []).join("\n"),
        benefitsDe: (j.benefitsDe || []).join("\n"),
        benefitsEn: (j.benefitsEn || []).join("\n"),
      });
    }
  }, [data]);

  // Auth redirect (render-time)
  if (!isPending && !session) {
    router.push(`/${adminBase}admin/login`);
    return null;
  }

  function update(field: keyof JobData, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function splitLines(text: string): string[] {
    return text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const slug = form.slug || toSlug(form.titleDe);
    const payload = {
      slug,
      active: form.active,
      isApprenticeship: form.isApprenticeship,
      sortOrder: form.sortOrder,
      titleDe: form.titleDe,
      titleEn: form.titleEn || null,
      durationDe: form.durationDe || null,
      durationEn: form.durationEn || null,
      tasksDe: splitLines(form.tasksDe),
      tasksEn: splitLines(form.tasksEn),
      requirementsDe: splitLines(form.requirementsDe),
      requirementsEn: splitLines(form.requirementsEn),
      benefitsDe: splitLines(form.benefitsDe),
      benefitsEn: splitLines(form.benefitsEn),
    };

    try {
      const url = isNew ? "/api/jobs" : `/api/jobs/${jobId}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push(`/${adminBase}admin`);
      } else {
        const data = await res.json();
        setError(data.error || t("saveError"));
      }
    } catch {
      setError(t("saveError"));
    }
    setSaving(false);
  }

  const loading = !isNew && isLoading;

  if (isPending || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">{tc("loading")}</p>
      </div>
    );
  }

  if (!session) return null;

  const inputCls =
    "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase mb-1";

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${adminBase}admin`}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
        >
          {t("back")}
        </Link>

        <h1 className="text-2xl font-bold mb-6">
          {isNew ? t("newTitle") : t("editTitle")}
        </h1>

        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-6">
          {/* Basic info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="job-titleDe" className={labelCls}>{t("titleDe")}</label>
              <input
                id="job-titleDe"
                type="text"
                value={form.titleDe}
                onChange={(e) => update("titleDe", e.target.value)}
                placeholder={t("titleDePlaceholder")}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label htmlFor="job-titleEn" className={labelCls}>{t("titleEn")}</label>
              <input
                id="job-titleEn"
                type="text"
                value={form.titleEn}
                onChange={(e) => update("titleEn", e.target.value)}
                placeholder={t("titleEnPlaceholder")}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="job-slug" className={labelCls}>{t("slug")}</label>
              <input
                id="job-slug"
                type="text"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder={toSlug(form.titleDe) || "auto-generiert"}
                className={`${inputCls} font-mono text-sm`}
              />
              <p className="text-xs text-gray-400 mt-1">
                {t("slugHint")}
              </p>
            </div>
            <div>
              <label htmlFor="job-sortOrder" className={labelCls}>{t("sortOrder")}</label>
              <input
                id="job-sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  update("sortOrder", parseInt(e.target.value) || 0)
                }
                className={inputCls}
              />
            </div>
            <div className="flex items-end gap-4 pb-2">
              <label htmlFor="job-active" className="flex items-center gap-2 cursor-pointer">
                <input
                  id="job-active"
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => update("active", e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{t("active")}</span>
              </label>
              <label htmlFor="job-apprenticeship" className="flex items-center gap-2 cursor-pointer">
                <input
                  id="job-apprenticeship"
                  type="checkbox"
                  checked={form.isApprenticeship}
                  onChange={(e) =>
                    update("isApprenticeship", e.target.checked)
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{t("apprenticeship")}</span>
              </label>
            </div>
          </div>

          {/* Duration (apprenticeship) */}
          {form.isApprenticeship && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="job-durationDe" className={labelCls}>{t("durationDe")}</label>
                <input
                  id="job-durationDe"
                  type="text"
                  value={form.durationDe}
                  onChange={(e) => update("durationDe", e.target.value)}
                  placeholder={t("durationDePlaceholder")}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="job-durationEn" className={labelCls}>{t("durationEn")}</label>
                <input
                  id="job-durationEn"
                  type="text"
                  value={form.durationEn}
                  onChange={(e) => update("durationEn", e.target.value)}
                  placeholder={t("durationEnPlaceholder")}
                  className={inputCls}
                />
              </div>
            </div>
          )}

          {/* Tasks */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="job-tasksDe" className={labelCls}>{t("tasksDe")}</label>
              <textarea
                id="job-tasksDe"
                value={form.tasksDe}
                onChange={(e) => update("tasksDe", e.target.value)}
                rows={4}
                placeholder={t("tasksDePlaceholder")}
                className={`${inputCls} resize-y`}
              />
            </div>
            <div>
              <label htmlFor="job-tasksEn" className={labelCls}>{t("tasksEn")}</label>
              <textarea
                id="job-tasksEn"
                value={form.tasksEn}
                onChange={(e) => update("tasksEn", e.target.value)}
                rows={4}
                placeholder={t("tasksEnPlaceholder")}
                className={`${inputCls} resize-y`}
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="job-requirementsDe" className={labelCls}>{t("requirementsDe")}</label>
              <textarea
                id="job-requirementsDe"
                value={form.requirementsDe}
                onChange={(e) => update("requirementsDe", e.target.value)}
                rows={4}
                placeholder={t("requirementsDePlaceholder")}
                className={`${inputCls} resize-y`}
              />
            </div>
            <div>
              <label htmlFor="job-requirementsEn" className={labelCls}>{t("requirementsEn")}</label>
              <textarea
                id="job-requirementsEn"
                value={form.requirementsEn}
                onChange={(e) => update("requirementsEn", e.target.value)}
                rows={4}
                placeholder={t("requirementsEnPlaceholder")}
                className={`${inputCls} resize-y`}
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="job-benefitsDe" className={labelCls}>{t("benefitsDe")}</label>
              <textarea
                id="job-benefitsDe"
                value={form.benefitsDe}
                onChange={(e) => update("benefitsDe", e.target.value)}
                rows={4}
                placeholder={t("benefitsDePlaceholder")}
                className={`${inputCls} resize-y`}
              />
            </div>
            <div>
              <label htmlFor="job-benefitsEn" className={labelCls}>{t("benefitsEn")}</label>
              <textarea
                id="job-benefitsEn"
                value={form.benefitsEn}
                onChange={(e) => update("benefitsEn", e.target.value)}
                rows={4}
                placeholder={t("benefitsEnPlaceholder")}
                className={`${inputCls} resize-y`}
              />
            </div>
          </div>

          {/* Error + Submit */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.titleDe}
              className="bg-primary hover:bg-primary-light text-white font-semibold py-2 px-6 rounded transition-colors disabled:opacity-50"
            >
              {saving ? t("saving") : t("save")}
            </button>
            <Link
              href={`/${adminBase}admin`}
              className="text-gray-500 hover:text-gray-700 py-2 px-6 border border-gray-300 rounded"
            >
              {t("cancel")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
