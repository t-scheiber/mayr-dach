"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: "de" | "en") {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="grid grid-cols-[35px_4px_35px] items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale("de")}
        className={`motion-press px-2 py-1 rounded ${
          locale === "de"
            ? "bg-primary text-white font-semibold"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        DE
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={`motion-press px-2 py-1 rounded ${
          locale === "en"
            ? "bg-primary text-white font-semibold"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        EN
      </button>
    </div>
  );
}
