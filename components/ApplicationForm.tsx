"use client";

import { Suspense } from "react";
import ApplicationFormContent from "./ApplicationFormContent";

export default function ApplicationForm() {
  return (
    <Suspense>
      <ApplicationFormContent />
    </Suspense>
  );
}
