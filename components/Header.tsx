"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { User, Menu, X } from "lucide-react";

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileMenuOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [mobileMenuOpen]);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/ueber-uns", label: t("nav.about") },
    { href: "/leistungen", label: t("nav.services") },
    { href: "/jobs", label: t("nav.jobs") },
    { href: "/kontakt", label: t("nav.contact") },
  ] as const;

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative overflow-hidden rounded-lg bg-white p-1 shadow-sm border border-gray-100 group-hover:shadow-md">
              <Image
                src="/images/logo/logo.png"
                alt="Karl Mayr GmbH & Co. KG"
                width={159}
                height={80}
                priority
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="hidden lg:flex flex-col w-[100px] whitespace-nowrap">
              <span className="text-xl font-bold text-gray-900 tracking-tight leading-none mb-1">
                Karl Mayr
              </span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider leading-none">
                GmbH & Co. KG
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative text-base font-medium tracking-wide   py-1 ${
                    isActive ? "text-primary" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  <span className="nav-indicator absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                </Link>
              );
            })}

            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              <LanguageSwitcher />
              {process.env.NEXT_PUBLIC_DEMO_MODE !== "true" && (<Link
                href="/admin/login"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-primary hover:text-white border border-gray-100 hover:border-transparent shadow-sm hover:shadow-md"
                title={t("footer.adminLogin")}
              >
                <User size={18} strokeWidth={2.5} />
              </Link>)}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="motion-press md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(open => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div
            id="mobile-navigation"
            data-open={mobileMenuOpen}
            inert={!mobileMenuOpen}
            aria-hidden={!mobileMenuOpen}
            className="mobile-menu md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden shadow-lg absolute w-full"
          >
            <nav className="flex flex-col px-6 py-6 space-y-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                  aria-current={isActive ? "page" : undefined}
                    className={`text-lg font-semibold py-2 border-b border-gray-50 ${
                      isActive ? "text-primary" : "text-gray-700"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 flex items-center justify-between">
                <LanguageSwitcher />
                {process.env.NEXT_PUBLIC_DEMO_MODE !== "true" && (<Link
                  href="/admin/login"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 border border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} />
                  <span>{t("footer.adminLogin")}</span>
                </Link>)}
              </div>
            </nav>
      </div>
    </header>
  );
}
