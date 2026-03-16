"use client";

import { useReducer } from "react";
import useSWR, { mutate } from "swr";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
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

interface Project {
  id: string;
  slug: string;
  name: string;
  location: string | null;
  active: boolean;
  featured: boolean;
  images: string[];
  sortOrder: number;
}

type Tab = "bewerbungen" | "stellenangebote" | "projekte";

interface UIState {
  tab: Tab;
  deletingJob: string | null;
  deletingProject: string | null;
}

type UIAction =
  | { type: "SET_TAB"; tab: Tab }
  | { type: "SET_DELETING_JOB"; id: string | null }
  | { type: "SET_DELETING_PROJECT"; id: string | null };

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.tab };
    case "SET_DELETING_JOB":
      return { ...state, deletingJob: action.id };
    case "SET_DELETING_PROJECT":
      return { ...state, deletingProject: action.id };
    default:
      return state;
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin.dashboard");
  const tc = useTranslations("common");

  const [state, dispatch] = useReducer(uiReducer, {
    tab: "bewerbungen",
    deletingJob: null,
    deletingProject: null,
  });

  const { tab, deletingJob, deletingProject } = state;

  const adminBase = locale === "de" ? "" : locale + "/";

  // SWR data fetching - only fetch when authenticated
  const { data: appsData, isLoading: loadingApps } = useSWR(
    session ? "/api/applications/list" : null,
    fetcher
  );
  const { data: jobsData, isLoading: loadingJobs } = useSWR(
    session ? "/api/jobs?all=true" : null,
    fetcher
  );
  const { data: projectsData, isLoading: loadingProjects } = useSWR(
    session ? "/api/projects?all=true" : null,
    fetcher
  );

  const applications: Application[] = appsData?.applications || [];
  const jobs: Job[] = jobsData?.jobs || [];
  const projects: Project[] = projectsData?.projects || [];

  // Event handlers
  async function handleDeleteJob(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    dispatch({ type: "SET_DELETING_JOB", id });
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (res.ok) {
      mutate("/api/jobs?all=true");
    }
    dispatch({ type: "SET_DELETING_JOB", id: null });
  }

  async function handleDeleteProject(id: string) {
    if (!confirm(t("confirmDeleteProject"))) return;
    dispatch({ type: "SET_DELETING_PROJECT", id });
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      mutate("/api/projects?all=true");
    }
    dispatch({ type: "SET_DELETING_PROJECT", id: null });
  }

  async function handleToggleProject(id: string, currentActive: boolean) {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !currentActive }),
    });
    if (res.ok) {
      mutate("/api/projects?all=true");
    }
  }

  async function handleToggleJob(id: string, currentActive: boolean) {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !currentActive }),
    });
    if (res.ok) {
      mutate("/api/jobs?all=true");
    }
  }

  // Auth loading state
  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">{tc("loading")}</p>
      </div>
    );
  }

  // Redirect unauthenticated users (render-time check, not useEffect)
  if (!session) {
    router.push(`/${adminBase}admin/login`);
    return null;
  }

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    REVIEWING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    NEW: t("statusNew"),
    REVIEWING: t("statusReviewing"),
    ACCEPTED: t("statusAccepted"),
    REJECTED: t("statusRejected"),
  };

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-gray-500">
              {t("loggedInAs")} {session.user.email}
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
            {t("signOut")}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => dispatch({ type: "SET_TAB", tab: "bewerbungen" })}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "bewerbungen"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("applications")}
            {applications.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {applications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => dispatch({ type: "SET_TAB", tab: "stellenangebote" })}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "stellenangebote"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("jobListings")}
            {jobs.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {jobs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => dispatch({ type: "SET_TAB", tab: "projekte" })}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "projekte"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("projects")}
            {projects.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {projects.length}
              </span>
            )}
          </button>
        </div>

        {/* Applications Tab */}
        {tab === "bewerbungen" && (
          <>
            {loadingApps ? (
              <p className="text-gray-500">{tc("loading")}</p>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  {t("noApplications")}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        {t("name")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        {t("position")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">
                        {t("email")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden lg:table-cell">
                        {t("phone")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        {t("status")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">
                        {t("date")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">
                        {t("documents")}
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
                          {app.position || "\u2014"}
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
                              {t("cv")}
                            </a>
                            {app.motivationFilename && (
                              <a
                                href={`/api/applications/${app.id}/files/motivation`}
                                target="_blank"
                                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                              >
                                {t("motivation")}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/${adminBase}admin/applications/${app.id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            {t("details")}
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
                {t("newJob")}
              </Link>
            </div>

            {loadingJobs ? (
              <p className="text-gray-500">{tc("loading")}</p>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  {t("noJobs")}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        {t("titleCol")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">
                        {t("slug")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        {t("status")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">
                        {t("type")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">
                        {t("sortOrder")}
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-600 text-right">
                        {t("actions")}
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
                            {job.active ? t("active") : t("inactive")}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                          {job.isApprenticeship ? t("apprenticeship") : t("jobType")}
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
                              {t("edit")}
                            </Link>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              disabled={deletingJob === job.id}
                              className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                            >
                              {deletingJob === job.id
                                ? "..."
                                : t("delete")}
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
        {/* Projects Tab */}
        {tab === "projekte" && (
          <>
            <div className="flex justify-end mb-4">
              <Link
                href={`/${adminBase}admin/projects/new`}
                className="bg-primary hover:bg-primary-light text-white font-semibold text-sm px-4 py-2 rounded transition-colors"
              >
                {t("newProject")}
              </Link>
            </div>

            {loadingProjects ? (
              <p className="text-gray-500">{tc("loading")}</p>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-500">{t("noProjects")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        {t("name")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">
                        {t("location")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">
                        {t("images")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        {t("status")}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">
                        {t("featured")}
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-600 text-right">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {project.name}
                        </td>
                        <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">
                          {project.location || "\u2014"}
                        </td>
                        <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                          {project.images.length}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              handleToggleProject(project.id, project.active)
                            }
                            className={`text-xs font-medium px-2 py-1 rounded cursor-pointer transition-colors ${
                              project.active
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {project.active ? t("active") : t("inactive")}
                          </button>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          {project.featured && (
                            <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                              {t("featured")}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-end">
                            <Link
                              href={`/${adminBase}admin/projects/${project.id}`}
                              className="text-primary hover:underline text-sm"
                            >
                              {t("edit")}
                            </Link>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={deletingProject === project.id}
                              className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                            >
                              {deletingProject === project.id
                                ? "..."
                                : t("delete")}
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
