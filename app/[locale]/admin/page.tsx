"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string | null;
  status: string;
  cvFilename: string;
  motivationFilename: string | null;
  createdAt: string;
}

interface Job {
  id: string;
  slug: string;
  titleDe: string;
  titleEn: string | null;
  active: boolean;
  isApprenticeship: boolean;
  sortOrder: number;
  createdAt: string;
}

type Tab = "bewerbungen" | "stellenangebote";

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const [tab, setTab] = useState<Tab>("bewerbungen");
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [deletingJob, setDeletingJob] = useState<string | null>(null);

  const adminBase = locale === "de" ? "" : locale + "/";

  useEffect(() => {
    if (!isPending && !session) {
      router.push(`/${adminBase}admin/login`);
    }
  }, [session, isPending, router, adminBase]);

  useEffect(() => {
    if (session) {
      fetch("/api/applications/list")
        .then((res) => res.json())
        .then((data) => {
          setApplications(data.applications || []);
          setLoadingApps(false);
        })
        .catch(() => setLoadingApps(false));

      fetch("/api/jobs?all=true")
        .then((res) => res.json())
        .then((data) => {
          setJobs(data.jobs || []);
          setLoadingJobs(false);
        })
        .catch(() => setLoadingJobs(false));
    }
  }, [session]);

  async function handleDeleteJob(id: string) {
    if (!confirm("Stellenangebot wirklich löschen?")) return;
    setDeletingJob(id);
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
    setDeletingJob(null);
  }

  async function handleToggleJob(id: string, currentActive: boolean) {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !currentActive }),
    });
    if (res.ok) {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, active: !currentActive } : j))
      );
    }
  }

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    );
  }

  if (!session) return null;

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    REVIEWING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    NEW: "Neu",
    REVIEWING: "In Prüfung",
    ACCEPTED: "Angenommen",
    REJECTED: "Abgelehnt",
  };

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Administration</h1>
            <p className="text-sm text-gray-500">
              Angemeldet als {session.user.email}
            </p>
          </div>
          <button
            onClick={() =>
              signOut().then(() =>
                router.push(`/${adminBase}admin/login`)
              )
            }
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-4 py-2 rounded"
          >
            Abmelden
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setTab("bewerbungen")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "bewerbungen"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Bewerbungen
            {applications.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {applications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("stellenangebote")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "stellenangebote"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Stellenangebote
            {jobs.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {jobs.length}
              </span>
            )}
          </button>
        </div>

        {/* Applications Tab */}
        {tab === "bewerbungen" && (
          <>
            {loadingApps ? (
              <p className="text-gray-500">Laden...</p>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Noch keine Bewerbungen eingegangen.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Position
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">
                        E-Mail
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden lg:table-cell">
                        Telefon
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">
                        Datum
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">
                        Dokumente
                      </th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">{app.name}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {app.position || "—"}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <a
                            href={`mailto:${app.email}`}
                            className="text-primary hover:underline"
                          >
                            {app.email}
                          </a>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <a
                            href={`tel:${app.phone}`}
                            className="text-primary hover:underline"
                          >
                            {app.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              statusColors[app.status] || ""
                            }`}
                          >
                            {statusLabels[app.status] || app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">
                          {new Date(app.createdAt).toLocaleDateString("de-AT")}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="flex gap-2">
                            <a
                              href={`/api/applications/${app.id}/files/cv`}
                              target="_blank"
                              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                            >
                              CV
                            </a>
                            {app.motivationFilename && (
                              <a
                                href={`/api/applications/${app.id}/files/motivation`}
                                target="_blank"
                                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                              >
                                Motivation
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/${adminBase}admin/applications/${app.id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Jobs Tab */}
        {tab === "stellenangebote" && (
          <>
            <div className="flex justify-end mb-4">
              <Link
                href={`/${adminBase}admin/jobs/new`}
                className="bg-primary hover:bg-primary-light text-white font-semibold text-sm px-4 py-2 rounded transition-colors"
              >
                + Neues Stellenangebot
              </Link>
            </div>

            {loadingJobs ? (
              <p className="text-gray-500">Laden...</p>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Noch keine Stellenangebote vorhanden.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Titel
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">
                        Slug
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">
                        Typ
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">
                        Reihenfolge
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-600 text-right">
                        Aktionen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {job.titleDe}
                        </td>
                        <td className="py-3 px-4 text-gray-500 font-mono text-xs hidden sm:table-cell">
                          {job.slug}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              handleToggleJob(job.id, job.active)
                            }
                            className={`text-xs font-medium px-2 py-1 rounded cursor-pointer transition-colors ${
                              job.active
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {job.active ? "Aktiv" : "Inaktiv"}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                          {job.isApprenticeship ? "Lehrstelle" : "Stelle"}
                        </td>
                        <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                          {job.sortOrder}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-end">
                            <Link
                              href={`/${adminBase}admin/jobs/${job.id}`}
                              className="text-primary hover:underline text-sm"
                            >
                              Bearbeiten
                            </Link>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              disabled={deletingJob === job.id}
                              className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                            >
                              {deletingJob === job.id
                                ? "..."
                                : "Löschen"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
