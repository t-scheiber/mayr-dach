"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import company from "@/content/company.json";
import partners from "@/content/partners.json";

export default function Footer() {
  const t = useTranslations();
  const { address, phone, email } = company.company;
  const [clickedPartner, setClickedPartner] = useState<string | null>(null);

  const handlePartnerClick = (name: string, url: string) => {
    setClickedPartner(name);
    setTimeout(() => {
      window.open(url, "_blank");
      setClickedPartner(null);
    }, 400);
  };

  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800">
      {/* Partners */}
      <div className="border-b border-slate-800/50 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400">
              {t("footer.partners")}
            </h3>
            <div className="mt-2 w-12 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-6">
            {partners.partners.map((partner) => (
              <div
                key={partner.name}
                onClick={() => handlePartnerClick(partner.name, partner.url)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handlePartnerClick(partner.name, partner.url); } }}
                className={`cursor-pointer bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-center justify-center h-24 group transform transform-gpu
                  ${
                    clickedPartner === partner.name
                      ? "scale-90 opacity-0 -translate-y-4 duration-300 ease-in"
                      : "hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                  }
                `}
                title={partner.name}
                role="link"
                tabIndex={0}
              >
                <div className="relative w-full h-full filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  <Image
                    src={`/images/partners/${partner.logo}`}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6 bg-white p-2 rounded-xl">
              <Image
                src="/images/logo/logo.png"
                alt="Karl Mayr GmbH & Co. KG"
                width={120}
                height={120}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ihr zuverlässiger Partner für Dach, Fassade und Glas in Saalfelden und Umgebung. Meisterhafte Handwerkskunst seit 1972.
            </p>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-white mb-6">
              {t("footer.location")}
            </h3>
            <address className="not-italic text-sm text-slate-400 space-y-2">
              <p className="font-semibold text-slate-200">{company.company.name}</p>
              <p>{address.street}</p>
              <p>{address.zip} {address.city}</p>
            </address>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-white mb-6">
              {t("footer.contact")}
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <a href={`tel:${phone}`} className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                {email}
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-white mb-6">
              Links
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/impressum" className="hover:text-white hover:underline transition-all">
                  {t("nav.impressum")}
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-white hover:underline transition-all">
                  {t("nav.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white hover:underline transition-all">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {company.company.name}. Alle Rechte vorbehalten.
          </p>
          <div className="text-xs text-slate-600">
            Designed with precision
          </div>
        </div>
      </div>
    </footer>
  );
}
