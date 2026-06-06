import type { ReactNode } from "react";

export function StatCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-white/10 bg-[#0d1117] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.28)] ${className}`}
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </p>
      {children}
    </section>
  );
}
