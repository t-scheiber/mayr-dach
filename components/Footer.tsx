"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import company from "@/content/company.json";
import partners from "@/content/partners.json";

export default function Footer() {
  const t = useTranslations();
  const { address, phone, email } = company.company;

  return (
    <footer className="bg-gray-900 text-white">
      {/* Partners */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <h3 className="text-sm font-semibold uppercase text-gray-400 mb-4">
            {t("footer.partners")}
          </h3>
          <div className="flex flex-wrap gap-4 items-center">
            {partners.partners.map((partner) => (
              <div
                key={partner.name}
                onClick={() => window.open(partner.url, "_blank")}
                className="cursor-pointer bg-white rounded px-4 py-3 opacity-80 hover:opacity-100 transition-opacity"
                title={partner.name}
                role="link"
              >
                <Image
                  src={`/images/partners/${partner.logo}`}
                  alt={partner.name}
                  width={80}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-400 mb-3">
              {t("footer.location")}
            </h3>
            <p className="text-sm text-gray-300">
              {company.company.name}
              <br />
              {address.street}
              <br />
              {address.zip} {address.city}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-400 mb-3">
              {t("footer.contact")}
            </h3>
            <p className="text-sm text-gray-300">
              <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                {phone}
              </a>
              <br />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-400 mb-3">
              Links
            </h3>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <Link href="/impressum" className="hover:text-white transition-colors">
                {t("nav.impressum")}
              </Link>
              <Link href="/datenschutz" className="hover:text-white transition-colors">
                {t("nav.privacy")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} {company.company.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
