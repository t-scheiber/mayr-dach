"use client";

import { useParams } from "next/navigation";
import JobEditor from "@/components/JobEditor";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;
  return <JobEditor jobId={id} />;
}
