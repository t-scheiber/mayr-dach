export function GlassShimmer({ children }: {
  children: React.ReactNode;
  intensity?: "subtle" | "medium" | "bold";
}) {
  return <div className="relative overflow-hidden rounded-lg inline-block w-full">{children}</div>;
}
