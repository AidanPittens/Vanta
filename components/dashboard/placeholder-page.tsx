import { AppShell } from "@/components/dashboard/app-shell";

export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-200/70">
          Vanta
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          {description}
        </p>
      </div>

      <section className="rounded-lg border border-white/10 bg-[#0d1117] p-6">
        <div className="flex min-h-56 items-center justify-center rounded-md border border-dashed border-white/10 bg-black/20">
          <p className="text-sm text-zinc-500">Placeholder content</p>
        </div>
      </section>
    </AppShell>
  );
}
