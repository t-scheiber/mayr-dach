"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";

interface ApplicationDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string | null;
  status: string;
  notes: string | null;
  cvFilename: string;
  motivationFilename: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: "NEW", label: "Neu" },
  { value: "REVIEWING", label: "In Prüfung" },
  { value: "ACCEPTED", label: "Angenommen" },
  { value: "REJECTED", label: "Abgelehnt" },
];

export default function ApplicationDetailPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.push(`/${locale === "de" ? "" : locale + "/"}admin/login`);
    }
  }, [session, isPending, router, locale]);

  useEffect(() => {
    if (session && id) {
      fetch(`/api/applications/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setApplication(data.application);
          setNotes(data.application?.notes || "");
          setStatus(data.application?.status || "NEW");
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session, id]);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    setSaving(false);
  }

  if (isPending || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    );
  }

  if (!session || !application) return null;

  const adminBase = locale === "de" ? "" : locale + "/";

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${adminBase}admin`}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
        >
          ← Zurück zur Übersicht
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{application.name}</h1>
              <p className="text-sm text-gray-500">
                Beworben am {new Date(application.createdAt).toLocaleDateString("de-AT", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">E-Mail</h3>
              <a href={`mailto:${application.email}`} className="text-primary hover:underline break-all">
                {application.email}
              </a>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Telefon</h3>
              <a href={`tel:${application.phone}`} className="text-primary hover:underline">
                {application.phone}
              </a>
            </div>
            {application.position && (
              <div className="sm:col-span-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Position</h3>
                <p>{application.position}</p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Dokumente</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`/api/applications/${id}/files/cv`}
                target="_blank"
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-light transition-colors text-sm truncate"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="truncate">{application.cvFilename}</span>
              </a>
              {application.motivationFilename && (
                <a
                  href={`/api/applications/${id}/files/motivation`}
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors text-sm truncate"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="truncate">{application.motivationFilename}</span>
                </a>
              )}
            </div>
          </div>

          {/* Status + Notes */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div>
              <label htmlFor="status" className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Interne Notizen
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Notizen zu dieser Bewerbung..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary-light text-white font-semibold py-2 px-6 rounded transition-colors disabled:opacity-50"
            >
              {saving ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
