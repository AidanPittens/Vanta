import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";

export function PlaceholderPage({
  title,
  description,
  cards = [],
}: {
  title: string;
  description: string;
  cards?: {
    title: string;
    body: string;
    meta?: string;
  }[];
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <StatCard key={card.title} title={card.title}>
            <p className="text-2xl font-semibold text-white">{card.body}</p>
            {card.meta ? (
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {card.meta}
              </p>
            ) : null}
          </StatCard>
        ))}
      </div>
    </AppShell>
  );
}
