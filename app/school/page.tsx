import { Suspense } from "react";

import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  getVantaData,
  type Course,
  type LectureProgress,
  type SchoolEvent,
} from "@/lib/vanta/data";

const today = new Date("2026-06-07T00:00:00");
const highPriorityTypes = new Set(["quiz", "midterm", "final", "lab", "lab_test"]);

function formatEventMeta(event: {
  date: string;
  time?: string | null;
  location?: string | null;
  submission_method?: string | null;
}) {
  const parts = [event.date, event.time, event.location, event.submission_method].filter(Boolean);

  return parts.join(" · ");
}

function daysUntil(dateValue: string) {
  const dueDate = new Date(`${dateValue}T00:00:00`);
  const dayMs = 24 * 60 * 60 * 1000;

  return Math.ceil((dueDate.getTime() - today.getTime()) / dayMs);
}

function isHighPriorityEvent(event: SchoolEvent) {
  if (event.priority === "high" || highPriorityTypes.has(event.event_type)) {
    return true;
  }

  return event.event_type === "assignment" && daysUntil(event.date) <= 3;
}

function priorityLabel(course: Course, events: SchoolEvent[]) {
  if (course.course_code === "MATH 218") {
    return "Highest priority";
  }

  if (events.some(isHighPriorityEvent)) {
    return "High priority";
  }

  if (events.some((event) => event.event_type === "assignment" && daysUntil(event.date) <= 7)) {
    return "Assignment soon";
  }

  return `Priority ${course.priority_level}`;
}

function lastLearned(progress: LectureProgress[]) {
  const learned = progress.filter((item) => item.learned);

  const item = learned.at(-1);

  if (!item) {
    return null;
  }

  return item.topic ? `${item.lecture_label}: ${item.topic}` : item.lecture_label;
}

function nextUp(course: Course, progress: LectureProgress[], events: SchoolEvent[]) {
  const incomplete = progress.find(
    (item) => !item.learned || !item.notes_written || !item.practice_completed,
  );

  if (incomplete) {
    const label = incomplete.topic
      ? `${incomplete.lecture_label}: ${incomplete.topic}`
      : incomplete.lecture_label;

    if (!incomplete.notes_written) {
      return `Write notes for ${label}`;
    }

    if (!incomplete.practice_completed) {
      return `Practice ${label}`;
    }

    return `Learn ${label}`;
  }

  const importantEvent = events.find(isHighPriorityEvent) ?? events[0];

  if (importantEvent) {
    return `Prepare for ${importantEvent.title}`;
  }

  return course.uses_lecture_tracking ? "Review current lecture notes" : "Check lab schedule";
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
  const { courses, schoolEvents, lectureProgress, setupErrors } = await getVantaData();

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
          Course priorities, lecture progress, and upcoming academic work from
          Supabase.
        </p>
      </div>

      {setupErrors.length > 0 ? (
        <div className="mb-4 rounded-md border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Setup needs attention: {setupErrors[0]}
        </div>
      ) : null}

      {courses.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {courses.map((course) => {
            const courseProgress = lectureProgress.filter(
              (item) =>
                item.course_id === course.id || item.courses?.course_code === course.course_code,
            );
            const courseEvents = schoolEvents.filter(
              (event) =>
                event.course_id === course.id || event.courses?.course_code === course.course_code,
            );
            const upcomingImportant = courseEvents.find(isHighPriorityEvent);
            const learned = lastLearned(courseProgress);

            return (
              <StatCard key={course.id} title={course.course_code}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {course.course_name}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-400">
                        {course.uses_lecture_tracking
                          ? "Lecture tracking"
                          : "Lab tracking only"}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md border border-sky-300/20 bg-sky-300/10 px-2 py-1 text-xs font-medium text-sky-100">
                      {priorityLabel(course, courseEvents)}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                        Last Learned
                      </p>
                      <p className="mt-2 text-sm text-zinc-200">
                        {learned ?? "No learned item yet"}
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                        Next Up
                      </p>
                      <p className="mt-2 text-sm text-zinc-200">
                        {nextUp(course, courseProgress, courseEvents)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                      Upcoming High Priority
                    </p>
                    {upcomingImportant ? (
                      <>
                        <p className="mt-2 text-sm font-medium text-white">
                          {upcomingImportant.title}
                        </p>
                        <p className="mt-2 text-sm text-zinc-400">
                          {formatEventMeta(upcomingImportant)}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                          {upcomingImportant.event_type}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-zinc-400">
                        No high-priority event scheduled.
                      </p>
                    )}
                  </div>
                </div>
              </StatCard>
            );
          })}
        </div>
      ) : (
        <StatCard title="Courses">
          <p className="text-sm text-zinc-400">
            No courses found yet. Vanta setup may not have seeded courses.
          </p>
        </StatCard>
      )}
    </AppShell>
  );
}
