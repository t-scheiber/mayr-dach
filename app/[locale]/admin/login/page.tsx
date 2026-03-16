"use client";

import { useState } from "react";
import { emailOtp, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function AdminLoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin.login");

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (error) {
      setError(error.message || t("sendError"));
      setLoading(false);
    } else {
      setStep("otp");
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signInWithOtp();

    if (error) {
      setError(error.message || t("codeError"));
      setLoading(false);
    } else {
      router.push(`/${locale === "de" ? "" : locale + "/"}admin`);
    }
  }

  async function signInWithOtp() {
    return signIn.emailOtp({
      email,
      otp,
    });
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-2">{t("title")}</h1>

          {step === "email" ? (
            <>
              <p className="text-gray-500 text-sm text-center mb-6">
                {t("emailPrompt")}
              </p>
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    {t("email")}
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
                  {loading ? "..." : t("sendCode")}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-sm text-center mb-6">
                {t("codeSent")}{" "}
                <strong className="text-gray-700">{email}</strong> {t("codeSentSuffix")}
              </p>
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-1">
                    {t("code")}
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-center text-2xl tracking-[0.3em] font-mono"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                >
                  {loading ? "..." : t("signIn")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                  }}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t("changeEmail")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
