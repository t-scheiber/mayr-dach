"use client";

import { useParams } from "next/navigation";
import ProjectEditor from "@/components/ProjectEditor";

export default function EditProjectPage() {
  const params = useParams();
  const id = params.id as string;
  return <ProjectEditor projectId={id} />;
}
