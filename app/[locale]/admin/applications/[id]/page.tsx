"use client";

import { useReducer, useEffect } from "react";
import useSWR from "swr";
import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

interface State {
  notes: string;
  status: string;
  saving: boolean;
  initialized: boolean;
}

type Action =
  | { type: "INIT"; notes: string; status: string }
  | { type: "SET_NOTES"; notes: string }
  | { type: "SET_STATUS"; status: string }
  | { type: "SET_SAVING"; saving: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return { ...state, notes: action.notes, status: action.status, initialized: true };
    case "SET_NOTES":
      return { ...state, notes: action.notes };
    case "SET_STATUS":
      return { ...state, status: action.status };
    case "SET_SAVING":
      return { ...state, saving: action.saving };
    default:
      return state;
  }
}

export default function ApplicationDetailPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations("admin.applicationDetail");
  const td = useTranslations("admin.dashboard");
  const tc = useTranslations("common");

  const adminBase = locale === "de" ? "" : locale + "/";

  const statusOptions = [
    { value: "NEW", label: td("statusNew") },
    { value: "REVIEWING", label: td("statusReviewing") },
    { value: "ACCEPTED", label: td("statusAccepted") },
    { value: "REJECTED", label: td("statusRejected") },
  ];

  const [state, dispatch] = useReducer(reducer, {
    notes: "",
    status: "NEW",
    saving: false,
    initialized: false,
  });

  const { data, isLoading } = useSWR(
    session && id ? `/api/applications/${id}` : null,
    fetcher
  );
  const application: ApplicationDetail | null = data?.application || null;

  // Initialize form from fetched data
  useEffect(() => {
    if (application && !state.initialized) {
      dispatch({
        type: "INIT",
        notes: application.notes || "",
        status: application.status || "NEW",
      });
    }
  }, [application, state.initialized]);

  // Auth redirect (render-time)
  if (!isPending && !session) {
    router.push(`/${adminBase}admin/login`);
    return null;
  }

  async function handleSave() {
    dispatch({ type: "SET_SAVING", saving: true });
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: state.status, notes: state.notes }),
    });
    dispatch({ type: "SET_SAVING", saving: false });
  }

  if (isPending || isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">{tc("loading")}</p>
      </div>
    );
  }

  if (!session || !application) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${adminBase}admin`}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
        >
          {t("back")}
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{application.name}</h1>
              <p className="text-sm text-gray-500">
                {t("appliedOn")} {new Date(application.createdAt).toLocaleDateString("de-AT", {
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
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("email")}</h3>
              <a href={`mailto:${application.email}`} className="text-primary hover:underline break-all">
                {application.email}
              </a>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("phone")}</h3>
              <a href={`tel:${application.phone}`} className="text-primary hover:underline">
                {application.phone}
              </a>
            </div>
            {application.position && (
              <div className="sm:col-span-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("position")}</h3>
                <p>{application.position}</p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">{t("documents")}</h3>
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
                {t("status")}
              </label>
              <select
                id="status"
                value={state.status}
                onChange={(e) => dispatch({ type: "SET_STATUS", status: e.target.value })}
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
                {t("notes")}
              </label>
              <textarea
                id="notes"
                value={state.notes}
                onChange={(e) => dispatch({ type: "SET_NOTES", notes: e.target.value })}
                rows={4}
                placeholder={t("notesPlaceholder")}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={state.saving}
              className="bg-primary hover:bg-primary-light text-white font-semibold py-2 px-6 rounded transition-colors disabled:opacity-50"
            >
              {state.saving ? t("saving") : t("save")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
