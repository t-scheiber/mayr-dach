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

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push(`/${locale === "de" ? "" : locale + "/"}admin/login`);
    }
  }, [session, isPending, router, locale]);

  useEffect(() => {
    if (session) {
      fetch("/api/applications/list")
        .then((res) => res.json())
        .then((data) => {
          setApplications(data.applications || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

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
            <h1 className="text-2xl font-bold">Bewerbungen</h1>
            <p className="text-sm text-gray-500">
              Angemeldet als {session.user.email}
            </p>
          </div>
          <button
            onClick={() => signOut().then(() => router.push(`/${locale === "de" ? "" : locale + "/"}admin/login`))}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-4 py-2 rounded"
          >
            Abmelden
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-500">Laden...</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Noch keine Bewerbungen eingegangen.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Position</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">E-Mail</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Telefon</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Datum</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Dokumente</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{app.name}</td>
                    <td className="py-3 px-4 text-gray-600">{app.position || "—"}</td>
                    <td className="py-3 px-4">
                      <a href={`mailto:${app.email}`} className="text-primary hover:underline">
                        {app.email}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <a href={`tel:${app.phone}`} className="text-primary hover:underline">
                        {app.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[app.status] || ""}`}>
                        {statusLabels[app.status] || app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString("de-AT")}
                    </td>
                    <td className="py-3 px-4">
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
                        href={`/${locale === "de" ? "" : locale + "/"}admin/applications/${app.id}`}
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
      </div>
    </section>
  );
}
