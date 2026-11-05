import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  ...(process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    unoptimized: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
