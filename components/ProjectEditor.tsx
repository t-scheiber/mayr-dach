"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ProjectData {
  slug: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  name: string;
  location: string;
  websiteUrl: string;
  categories: string;
  images: string;
  attribution: string;
}

const emptyProject: ProjectData = {
  slug: "",
  active: true,
  featured: false,
  sortOrder: 0,
  name: "",
  location: "",
  websiteUrl: "",
  categories: "",
  images: "",
  attribution: "",
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

export default function ProjectEditor({ projectId }: { projectId?: string }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin.projectEditor");
  const tc = useTranslations("common");
  const adminBase = locale === "de" ? "" : locale + "/";

  const isNew = !projectId;
  const [form, setForm] = useState<ProjectData>(emptyProject);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { data, isLoading } = useSWR(
    session && projectId ? `/api/projects/${projectId}` : null,
    fetcher
  );

  // Initialize form from fetched data
  useEffect(() => {
    if (data?.project) {
      const p = data.project;
      setForm({
        slug: p.slug,
        active: p.active,
        featured: p.featured,
        sortOrder: p.sortOrder,
        name: p.name,
        location: p.location || "",
        websiteUrl: p.websiteUrl || "",
        categories: (p.categories || []).join(", "),
        images: (p.images || []).join("\n"),
        attribution: p.attribution || "",
      });
    }
  }, [data]);

  // Auth redirect (render-time)
  if (!isPending && !session) {
    router.push(`/${adminBase}admin/login`);
    return null;
  }

  function update(field: keyof ProjectData, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function splitLines(text: string): string[] {
    return text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function splitComma(text: string): string[] {
    return text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const slug = form.slug || toSlug(form.name);
    const payload = {
      slug,
      active: form.active,
      featured: form.featured,
      sortOrder: form.sortOrder,
      name: form.name,
      location: form.location || null,
      websiteUrl: form.websiteUrl || null,
      categories: splitComma(form.categories),
      images: splitLines(form.images),
      attribution: form.attribution || null,
    };

    try {
      const url = isNew ? "/api/projects" : `/api/projects/${projectId}`;
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
          {/* Name */}
          <div>
            <label htmlFor="project-name" className={labelCls}>{t("name")}</label>
            <input
              id="project-name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={t("namePlaceholder")}
              className={inputCls}
              required
            />
          </div>

          {/* Slug, Sort Order, Active, Featured */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="project-slug" className={labelCls}>{t("slug")}</label>
              <input
                id="project-slug"
                type="text"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder={toSlug(form.name) || "auto-generiert"}
                className={`${inputCls} font-mono text-sm`}
              />
              <p className="text-xs text-gray-400 mt-1">
                {t("slugHint")}
              </p>
            </div>
            <div>
              <label htmlFor="project-sortOrder" className={labelCls}>{t("sortOrder")}</label>
              <input
                id="project-sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  update("sortOrder", parseInt(e.target.value) || 0)
                }
                className={inputCls}
              />
            </div>
            <div className="flex items-end gap-4 pb-2">
              <label htmlFor="project-active" className="flex items-center gap-2 cursor-pointer">
                <input
                  id="project-active"
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => update("active", e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{t("active")}</span>
              </label>
              <label htmlFor="project-featured" className="flex items-center gap-2 cursor-pointer">
                <input
                  id="project-featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => update("featured", e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{t("featured")}</span>
              </label>
            </div>
          </div>

          {/* Location & Website URL */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="project-location" className={labelCls}>{t("location")}</label>
              <input
                id="project-location"
                type="text"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder={t("locationPlaceholder")}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="project-websiteUrl" className={labelCls}>{t("websiteUrl")}</label>
              <input
                id="project-websiteUrl"
                type="text"
                value={form.websiteUrl}
                onChange={(e) => update("websiteUrl", e.target.value)}
                placeholder={t("websiteUrlPlaceholder")}
                className={inputCls}
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label htmlFor="project-categories" className={labelCls}>{t("categories")}</label>
            <input
              id="project-categories"
              type="text"
              value={form.categories}
              onChange={(e) => update("categories", e.target.value)}
              placeholder={t("categoriesPlaceholder")}
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">
              {t("categoriesHint")}
            </p>
          </div>

          {/* Images */}
          <div>
            <label htmlFor="project-images" className={labelCls}>{t("images")}</label>
            <textarea
              id="project-images"
              value={form.images}
              onChange={(e) => update("images", e.target.value)}
              rows={4}
              placeholder={t("imagesPlaceholder")}
              className={`${inputCls} resize-y`}
            />
            <p className="text-xs text-gray-400 mt-1">
              {t("imagesHint")}
            </p>
          </div>

          {/* Attribution */}
          <div>
            <label htmlFor="project-attribution" className={labelCls}>{t("attribution")}</label>
            <input
              id="project-attribution"
              type="text"
              value={form.attribution}
              onChange={(e) => update("attribution", e.target.value)}
              placeholder={t("attributionPlaceholder")}
              className={inputCls}
            />
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
              disabled={saving || !form.name}
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
