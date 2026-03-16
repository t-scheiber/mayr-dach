"use client";

import { usePathname } from "next/navigation";
import { MaterialSkeleton } from "@/components/animations";

const slugToVariant: Record<string, "tile" | "glass" | "metal" | "facade" | "sealing" | "greenRoof"> = {
  dachdeckerei: "tile",
  spenglerei: "metal",
  glaserei: "glass",
  fassade: "facade",
  abdichtungsarbeiten: "sealing",
  gruendaecher: "greenRoof",
};

export default function ServiceLoading() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop() || "";
  const variant = slugToVariant[slug] || "tile";

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero skeleton */}
      <div className="relative bg-gray-900 py-20 md:py-28 overflow-hidden">
        <MaterialSkeleton variant={variant} width="100%" height="100%" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-4 w-32 bg-white/20 rounded mb-4 animate-pulse" />
          <div className="h-10 w-96 max-w-full bg-white/20 rounded mb-4 animate-pulse" />
          <div className="h-6 w-[28rem] max-w-full bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="py-16 md:py-24 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="h-8 w-72 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
