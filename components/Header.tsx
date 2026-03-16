"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { User, Menu, X } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/ueber-uns", label: t("nav.about") },
    { href: "/leistungen", label: t("nav.services") },
    { href: "/jobs", label: t("nav.jobs") },
    { href: "/kontakt", label: t("nav.contact") },
  ] as const;

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative overflow-hidden rounded-lg bg-white p-1 shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
              <Image
                src="/images/logo/logo.png"
                alt="Karl Mayr GmbH & Co. KG"
                width={48}
                height={48}
                className="h-10 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="hidden lg:flex flex-col">
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
                  className={`relative text-base font-medium tracking-wide transition-colors duration-200 py-1 ${
                    isActive ? "text-primary" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <m.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              <LanguageSwitcher />
              <Link
                href="/admin/login"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 border border-gray-100 hover:border-transparent shadow-sm hover:shadow-md"
                title={t("footer.adminLogin")}
              >
                <User size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden shadow-lg absolute w-full"
          >
            <nav className="flex flex-col px-6 py-6 space-y-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
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
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors border border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} />
                  <span>{t("footer.adminLogin")}</span>
                </Link>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
