import { Suspense } from "react";

import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { getVantaData, type WorkoutSession, type WorkoutTemplate } from "@/lib/vanta/data";

import { WorkoutFlow } from "./workout-flow";

function sessionTemplateName(session: WorkoutSession | undefined) {
  return (
    session?.workout_templates?.name ??
    session?.template_name ??
    "Workout"
  );
}

function sessionDate(session: WorkoutSession | undefined) {
  const value = session?.completed_at ?? session?.created_at ?? session?.started_at;

  if (!value) {
    return "No completed sessions yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getNextTemplate(
  templates: WorkoutTemplate[],
  sessions: WorkoutSession[],
) {
  if (templates.length === 0) {
    return null;
  }

  if (sessions.length === 0) {
    return (
      templates.find((template) => template.name.toLowerCase() === "lower") ??
      templates[0]
    );
  }

  const lastName = sessionTemplateName(sessions[0]).toLowerCase();
  const lastIndex = templates.findIndex(
    (template) => template.name.toLowerCase() === lastName,
  );

  if (lastIndex === -1) {
    return templates.find((template) => template.name.toLowerCase() === "lower") ?? templates[0];
  }

  return templates[(lastIndex + 1) % templates.length];
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
  const { templates, workoutSessions, setupErrors, userId } = await getVantaData();
  const lastSession = workoutSessions[0];
  const nextTemplate = getNextTemplate(templates, workoutSessions);

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
            Start the next workout, choose a different template, and log working
            sets without tracking warm-ups.
          </p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          <span className="text-zinc-500">Next</span>
          <span className="ml-3 text-sky-100">
            {nextTemplate?.name ?? "No template"}
          </span>
        </div>
      </div>

      {setupErrors.length > 0 ? (
        <div className="mb-4 rounded-md border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Setup needs attention: {setupErrors[0]}
        </div>
      ) : null}

      <div className="mb-4 grid gap-4 lg:grid-cols-4">
        <StatCard title="Last Workout">
          <p className="text-2xl font-semibold text-white">
            {lastSession ? sessionTemplateName(lastSession) : "None yet"}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {sessionDate(lastSession)}
          </p>
        </StatCard>
        <StatCard title="Next Recommended">
          <p className="text-2xl font-semibold text-white">
            {nextTemplate?.name ?? "No template"}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {workoutSessions.length === 0
              ? "Defaulting to Lower until session history exists."
              : "Based on the most recent completed workout."}
          </p>
        </StatCard>
        <StatCard title="Queue Context">
          <p className="text-2xl font-semibold text-white">
            {lastSession
              ? `${sessionTemplateName(lastSession)} done`
              : "Fresh queue"}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {nextTemplate
              ? `${nextTemplate.name} is next in rotation.`
              : "Seed workout templates to build the queue."}
          </p>
        </StatCard>
        <StatCard title="Progression Rule">
          <p className="text-2xl font-semibold text-white">8 reps</p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Add weight after both sets hit 8 reps for 2 successful sessions at
            1-2 RIR.
          </p>
        </StatCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <StatCard title="Workout Flow">
          <WorkoutFlow
            defaultTemplate={nextTemplate}
            templates={templates}
            userId={userId}
          />
        </StatCard>

        <StatCard title="Recent Sessions">
          {workoutSessions.length > 0 ? (
            <div className="space-y-3">
              {workoutSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-md border border-white/10 bg-black/20 p-4"
                >
                  <p className="font-medium text-white">
                    {sessionTemplateName(session)}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    {sessionDate(session)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-zinc-400">
              No completed workout sessions yet.
            </p>
          )}
        </StatCard>
      </div>
    </AppShell>
  );
}
