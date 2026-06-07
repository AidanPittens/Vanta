import { Suspense } from "react";

import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { getVantaData, type WorkoutExercise } from "@/lib/vanta/data";

function formatRepRange(exercise: WorkoutExercise) {
  if (exercise.rep_min && exercise.rep_max) {
    return `${exercise.rep_min}-${exercise.rep_max}`;
  }

  return exercise.reps ?? "4-9";
}

function formatRirRange(exercise: WorkoutExercise) {
  if (exercise.target_rir_min && exercise.target_rir_max) {
    return `${exercise.target_rir_min}-${exercise.target_rir_max}`;
  }

  return exercise.rir ?? "1-2";
}

export default function TrainingPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <p className="text-sm text-zinc-400">Loading workout templates...</p>
        </AppShell>
      }
    >
      <TrainingContent />
    </Suspense>
  );
}

async function TrainingContent() {
  const { templates, setupErrors } = await getVantaData();

  return (
    <AppShell>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-200/70">
            Vanta
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Training
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Workout templates from Supabase. Logging comes later.
          </p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          <span className="text-zinc-500">Next</span>
          <span className="ml-3 text-sky-100">Lower</span>
        </div>
      </div>

      {setupErrors.length > 0 ? (
        <div className="mb-4 rounded-md border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Setup needs attention: {setupErrors[0]}
        </div>
      ) : null}

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <StatCard title="Queue Context">
          <p className="text-2xl font-semibold text-white">Upper done</p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Lower is next. Sunday is a rest day.
          </p>
        </StatCard>
        <StatCard title="Progression">
          <p className="text-2xl font-semibold text-white">8 reps</p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Add weight after both sets hit 8 reps for 2 successful sessions at
            1-2 RIR.
          </p>
        </StatCard>
        <StatCard title="Warm-Ups">
          <p className="text-2xl font-semibold text-white">Not tracked</p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Templates show working sets only.
          </p>
        </StatCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {templates.length > 0 ? (
          templates.map((template) => (
            <StatCard key={template.id} title={template.name}>
              {template.exercises.length > 0 ? (
                <div className="space-y-3">
                  {template.exercises.map((exercise) => (
                    <div
                      key={`${template.id}-${exercise.name}`}
                      className="rounded-md border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-medium text-white">{exercise.name}</p>
                        <p className="text-sm text-zinc-400">
                          {exercise.sets ?? 2} sets
                          {exercise.is_single_arm || exercise.single_arm
                            ? " per arm"
                            : ""}{" "}
                          · {formatRepRange(exercise)} reps ·{" "}
                          {formatRirRange(exercise)} RIR
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">
                  No exercises found for this template yet.
                </p>
              )}
            </StatCard>
          ))
        ) : (
          <StatCard title="Workout Templates" className="xl:col-span-2">
            <p className="text-sm text-zinc-400">
              No workout templates found yet.
            </p>
          </StatCard>
        )}
      </div>
    </AppShell>
  );
}
