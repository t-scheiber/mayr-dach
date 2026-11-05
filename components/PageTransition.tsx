import type {} from "react/canary";
import { ViewTransition, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

export function ServiceTitle({ slug, children }: { slug: string; children: ReactNode }) {
  return <ViewTransition name={`service-${slug}-title`} share="service-title" default="none">{children}</ViewTransition>;
}
