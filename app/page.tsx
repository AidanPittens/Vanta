import { Suspense } from "react";

import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { getVantaData } from "@/lib/vanta/data";

export default function TodayPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <p className="text-sm text-zinc-400">Loading Vanta...</p>
        </AppShell>
      }
    >
      <TodayContent />
    </Suspense>
  );
}

async function TodayContent() {
  const data = await getVantaData();
  const profile = data.profile;
  const topCourse = data.courses[0];
  const nextEvent = data.highPriorityEvents[0];
  const calories = profile?.calorie_target ?? 2900;
  const protein = profile?.protein_target ?? 125;

  return (
    <AppShell>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-200/70">
            Vanta
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Today
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            A focused readout for training, nutrition, school, and recovery.
          </p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          <span className="text-zinc-500">Status</span>
          <span className="ml-3 text-sky-100">
            {data.initialized ? "Vanta initialized" : "Ready"}
          </span>
        </div>
      </div>

      {data.setupErrors.length > 0 ? (
        <div className="mb-4 rounded-md border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Setup needs attention: {data.setupErrors[0]}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard title="Daily Command" className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-white">
            {profile ? `${profile.name}'s targets are loaded.` : "Targets loading"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            {profile?.goal ??
              "Default setup will appear here after Supabase returns profile data."}
          </p>
        </StatCard>

        <StatCard title="Core Recommendation">
          <p className="text-lg font-medium text-white">
            {topCourse ? `${topCourse.course_code} first` : "Protect the morning."}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {topCourse?.notes ??
              "Start with school practice before smaller tasks pull attention."}
          </p>
        </StatCard>

        <StatCard title="Next Workout">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-semibold text-white">Lower</p>
              <p className="mt-2 text-sm text-zinc-500">
                Upper completed recently. Sunday rest.
              </p>
            </div>
            <div className="h-16 w-2 rounded-full bg-sky-300/70" />
          </div>
        </StatCard>

        <StatCard title="Nutrition Snapshot">
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-400">Calories</span>
                <span className="font-medium text-white">0 / {calories}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-0 rounded-full bg-sky-300" />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-400">Protein</span>
                <span className="font-medium text-white">0 / {protein}g</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-0 rounded-full bg-sky-300" />
              </div>
            </div>
          </div>
        </StatCard>

        <StatCard title="School Priority">
          <p className="text-2xl font-semibold text-white">
            {nextEvent
              ? `${nextEvent.courses?.course_code ?? "School"} ${nextEvent.title}`
              : "MATH 218 practice"}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {nextEvent
              ? `Due ${nextEvent.due_date}${nextEvent.location ? ` at ${nextEvent.location}` : ""}.`
              : "Clear this before lower-priority admin work."}
          </p>
        </StatCard>

        <StatCard title="Daily Check-In" className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-3">
            {["Energy", "Stress", "Sleep"].map((item) => (
              <div
                key={item}
                className="rounded-md border border-white/10 bg-black/20 p-4"
              >
                <p className="text-sm font-medium text-white">{item}</p>
                <p className="mt-2 text-sm text-zinc-500">Not logged yet</p>
              </div>
            ))}
          </div>
        </StatCard>
      </div>
    </AppShell>
  );
}
