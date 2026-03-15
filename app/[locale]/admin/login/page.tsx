"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function AdminLoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn.email({
      email,
      password,
    });

    if (result.error) {
      setError(result.error.message || "Login fehlgeschlagen");
      setLoading(false);
    } else {
      router.push(`/${locale === "de" ? "" : locale + "/"}admin`);
    }
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Passwort
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Anmelden"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
