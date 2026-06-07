import { Suspense } from "react";

import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { getVantaData } from "@/lib/vanta/data";

function formatEventMeta(event: {
  due_date: string;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
}) {
  const time =
    event.start_time && event.end_time
      ? `${event.start_time}-${event.end_time}`
      : event.start_time;
  const parts = [event.due_date, time, event.location].filter(Boolean);

  return parts.join(" · ");
}

export default function SchoolPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <p className="text-sm text-zinc-400">Loading school data...</p>
        </AppShell>
      }
    >
      <SchoolContent />
    </Suspense>
  );
}

async function SchoolContent() {
  const { courses, highPriorityEvents, lectureProgress, setupErrors } =
    await getVantaData();

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-200/70">
          Vanta
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          School
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Courses, high-priority events, and lecture progress from Supabase.
        </p>
      </div>

      {setupErrors.length > 0 ? (
        <div className="mb-4 rounded-md border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Setup needs attention: {setupErrors[0]}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        <StatCard title="Courses" className="xl:col-span-2">
          {courses.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-md border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{course.code}</p>
                      <p className="mt-1 text-sm leading-5 text-zinc-400">
                        {course.name}
                      </p>
                    </div>
                    <span className="rounded-md border border-sky-300/20 bg-sky-300/10 px-2 py-1 text-xs font-medium text-sky-100">
                      P{course.priority_level}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-zinc-500">
                    {course.uses_lecture_tracking
                      ? "Lecture tracking"
                      : "Lab tracking only"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">No courses found yet.</p>
          )}
        </StatCard>

        <StatCard title="High Priority">
          <div className="space-y-3">
            {highPriorityEvents.map((event) => (
              <div
                key={`${event.course_id}-${event.title}-${event.due_date}`}
                className="rounded-md border border-white/10 bg-black/20 p-4"
              >
                <p className="text-sm font-medium text-white">
                  {event.courses?.code} {event.title}
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  {formatEventMeta(event)}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                  {event.event_type}
                </p>
              </div>
            ))}
          </div>
        </StatCard>

        <StatCard title="Lecture Progress" className="xl:col-span-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {lectureProgress.map((progress) => (
              <div
                key={`${progress.course_id}-${progress.title}`}
                className="rounded-md border border-white/10 bg-black/20 p-4"
              >
                <p className="font-medium text-white">
                  {progress.courses?.code} {progress.title}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <span className="rounded-md bg-emerald-300/10 px-2 py-2 text-center text-emerald-100">
                    Learned
                  </span>
                  <span className="rounded-md bg-white/5 px-2 py-2 text-center text-zinc-400">
                    Notes open
                  </span>
                  <span className="rounded-md bg-white/5 px-2 py-2 text-center text-zinc-400">
                    Practice open
                  </span>
                </div>
              </div>
            ))}
          </div>
        </StatCard>
      </div>
    </AppShell>
  );
}
