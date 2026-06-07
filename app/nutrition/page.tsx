import { Suspense } from "react";

import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { getVantaData } from "@/lib/vanta/data";

export default function NutritionPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <p className="text-sm text-zinc-400">Loading nutrition targets...</p>
        </AppShell>
      }
    >
      <NutritionContent />
    </Suspense>
  );
}

async function NutritionContent() {
  const { profile, setupErrors } = await getVantaData();
  const targets = [
    {
      label: "Calories",
      value: profile?.calorie_target ?? 2900,
      unit: "",
      meta: "Daily lean bulk target",
    },
    {
      label: "Protein",
      value: profile?.protein_target ?? 125,
      unit: "g",
      meta: "Daily protein target",
    },
    {
      label: "Carbs",
      value: profile?.carb_target ?? 438,
      unit: "g",
      meta: "Training fuel target",
    },
    {
      label: "Fat",
      value: profile?.fat_target ?? 78,
      unit: "g",
      meta: "Daily fat target",
    },
  ];

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-200/70">
          Vanta
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          Nutrition
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Profile-backed macro targets. Meal logging comes later.
        </p>
      </div>

      {setupErrors.length > 0 ? (
        <div className="mb-4 rounded-md border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Setup needs attention: {setupErrors[0]}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {targets.map((target) => (
          <StatCard key={target.label} title={target.label}>
            <p className="text-3xl font-semibold text-white">
              0 / {target.value}
              {target.unit}
            </p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className="h-2 w-0 rounded-full bg-sky-300" />
            </div>
            <p className="mt-3 text-sm text-zinc-400">{target.meta}</p>
          </StatCard>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <StatCard title="Current Weight">
          <p className="text-3xl font-semibold text-white">
            {profile?.current_weight ?? 155} lb
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Stored on your profile.
          </p>
        </StatCard>
        <StatCard title="Goal">
          <p className="text-lg font-medium leading-7 text-white">
            {profile?.goal ??
              "Lean bulk: gain muscle while minimizing fat gain"}
          </p>
        </StatCard>
      </div>
    </AppShell>
  );
}
