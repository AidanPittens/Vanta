"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { WorkoutExercise, WorkoutTemplate } from "@/lib/vanta/data";

type SetEntry = {
  weight: string;
  reps: string;
  rir: string;
};

type LoggedSets = Record<string, SetEntry>;

function exerciseTitle(exercise: WorkoutExercise) {
  return exercise.exercise_name ?? exercise.name ?? "Exercise";
}

function setKey(exerciseIndex: number, side: string, setNumber: number) {
  return `${exerciseIndex}:${side}:${setNumber}`;
}

function emptyEntry(): SetEntry {
  return { weight: "", reps: "", rir: "" };
}

function repRange(exercise: WorkoutExercise) {
  if (exercise.rep_min && exercise.rep_max) {
    return `${exercise.rep_min}-${exercise.rep_max} reps`;
  }

  return exercise.reps ?? "4-9 reps";
}

function rirRange(exercise: WorkoutExercise) {
  if (exercise.target_rir_min && exercise.target_rir_max) {
    return `${exercise.target_rir_min}-${exercise.target_rir_max} RIR`;
  }

  return exercise.rir ?? "1-2 RIR";
}

function SetInputs({
  entry,
  label,
  onChange,
}: {
  entry: SetEntry;
  label: string;
  onChange: (entry: SetEntry) => void;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
      <p className="mb-3 text-sm font-medium text-white">{label}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {(["weight", "reps", "rir"] as const).map((field) => (
          <label key={field} className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-zinc-500">
              {field === "rir" ? "RIR" : field}
            </span>
            <input
              className="h-10 w-full rounded-md border border-white/10 bg-[#090d13] px-3 text-sm text-white outline-none transition focus:border-sky-300/50"
              inputMode="decimal"
              type="number"
              value={entry[field]}
              onChange={(event) =>
                onChange({ ...entry, [field]: event.target.value })
              }
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export function WorkoutFlow({
  templates,
  defaultTemplate,
  userId,
}: {
  templates: WorkoutTemplate[];
  defaultTemplate: WorkoutTemplate | null;
  userId: string;
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    defaultTemplate?.id ?? templates[0]?.id ?? "",
  );
  const [choosing, setChoosing] = useState(false);
  const [active, setActive] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [sets, setSets] = useState<LoggedSets>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedTemplate = useMemo(
    () =>
      templates.find((template) => template.id === selectedTemplateId) ??
      defaultTemplate ??
      null,
    [defaultTemplate, selectedTemplateId, templates],
  );
  const activeExercise = selectedTemplate?.exercises[exerciseIndex] ?? null;
  const isFinalExercise =
    selectedTemplate && exerciseIndex === selectedTemplate.exercises.length - 1;

  function updateSet(key: string, entry: SetEntry) {
    setSets((current) => ({ ...current, [key]: entry }));
  }

  function startWorkout() {
    if (!selectedTemplate || selectedTemplate.exercises.length === 0) {
      setMessage("Choose a template with exercises before starting.");
      return;
    }

    setMessage(null);
    setExerciseIndex(0);
    setActive(true);
  }

  async function finishWorkout() {
    if (!selectedTemplate) {
      return;
    }

    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const completedAt = new Date().toISOString();
    const sessionAttempts: Record<string, string>[] = [
      {
        user_id: userId,
        template_id: selectedTemplate.id,
        template_name: selectedTemplate.name,
        status: "completed",
        started_at: completedAt,
        completed_at: completedAt,
      },
      {
        user_id: userId,
        template_id: selectedTemplate.id,
        status: "completed",
        completed_at: completedAt,
      },
      {
        user_id: userId,
        template_id: selectedTemplate.id,
        completed_at: completedAt,
      },
    ];

    let sessionId: string | null = null;
    let sessionError: string | null = null;

    for (const payload of sessionAttempts) {
      const { data, error } = await supabase
        .from("workout_sessions")
        .insert(payload)
        .select("id")
        .single();

      if (!error) {
        sessionId = data.id;
        sessionError = null;
        break;
      }

      sessionError = error.message;
    }

    if (!sessionId) {
      setSaving(false);
      setMessage(`Could not save workout session: ${sessionError ?? "unknown error"}`);
      return;
    }

    const rows = selectedTemplate.exercises.flatMap((exercise, index) => {
      const singleArm = exercise.is_single_arm || exercise.single_arm;
      const plannedSets = singleArm
        ? [
            ["left", 1],
            ["left", 2],
            ["right", 1],
            ["right", 2],
          ] as const
        : [
            ["both", 1],
            ["both", 2],
          ] as const;

      return plannedSets.map(([side, setNumber]) => {
        const entry = sets[setKey(index, side, setNumber)] ?? emptyEntry();

        return {
          workout_session_id: sessionId,
          template_exercise_id: exercise.id ?? null,
          exercise_name: exerciseTitle(exercise),
          set_number: setNumber,
          side,
          weight: entry.weight === "" ? null : Number(entry.weight),
          reps: entry.reps === "" ? null : Number(entry.reps),
          rir: entry.rir === "" ? null : Number(entry.rir),
          is_warmup: false,
        };
      });
    });

    const { error: setError } = await supabase.from("exercise_sets").insert(rows);

    setSaving(false);

    if (setError) {
      setMessage(`Workout saved, but sets failed to save: ${setError.message}`);
      return;
    }

    setActive(false);
    setSets({});
    setExerciseIndex(0);
    setMessage("Workout finished and saved.");
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
        No workout templates found yet.
      </div>
    );
  }

  if (!active || !activeExercise || !selectedTemplate) {
    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="border border-sky-300/30 bg-sky-300/15 text-sky-50 hover:bg-sky-300/25"
            onClick={startWorkout}
            type="button"
          >
            Start next workout
          </Button>
          <Button
            className="border border-white/10 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.08]"
            onClick={() => setChoosing((current) => !current)}
            type="button"
          >
            Choose workout
          </Button>
        </div>

        {choosing ? (
          <select
            className="h-10 w-full rounded-md border border-white/10 bg-[#090d13] px-3 text-sm text-white outline-none transition focus:border-sky-300/50 sm:max-w-xs"
            value={selectedTemplateId}
            onChange={(event) => setSelectedTemplateId(event.target.value)}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        ) : null}

        {message ? <p className="text-sm text-zinc-400">{message}</p> : null}
      </div>
    );
  }

  const singleArm = activeExercise.is_single_arm || activeExercise.single_arm;
  const visibleSets = singleArm
    ? [
        ["left", 1, "Left set 1"],
        ["left", 2, "Left set 2"],
        ["right", 1, "Right set 1"],
        ["right", 2, "Right set 2"],
      ] as const
    : [
        ["both", 1, "Set 1"],
        ["both", 2, "Set 2"],
      ] as const;

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-white/10 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
          {selectedTemplate.name} · {exerciseIndex + 1} of{" "}
          {selectedTemplate.exercises.length}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {exerciseTitle(activeExercise)}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          {activeExercise.sets ?? 2} working sets
          {singleArm ? " per arm" : ""} · {repRange(activeExercise)} ·{" "}
          {rirRange(activeExercise)}
        </p>
      </div>

      <div className="space-y-3">
        {visibleSets.map(([side, setNumber, label]) => {
          const key = setKey(exerciseIndex, side, setNumber);

          return (
            <SetInputs
              key={key}
              entry={sets[key] ?? emptyEntry()}
              label={label}
              onChange={(entry) => updateSet(key, entry)}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          className="border border-white/10 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.08]"
          disabled={exerciseIndex === 0 || saving}
          onClick={() => setExerciseIndex((current) => Math.max(0, current - 1))}
          type="button"
        >
          Back
        </Button>
        {isFinalExercise ? (
          <Button
            className="border border-emerald-300/30 bg-emerald-300/15 text-emerald-50 hover:bg-emerald-300/25"
            disabled={saving}
            onClick={finishWorkout}
            type="button"
          >
            {saving ? "Saving..." : "Finish Workout"}
          </Button>
        ) : (
          <Button
            className="border border-sky-300/30 bg-sky-300/15 text-sky-50 hover:bg-sky-300/25"
            disabled={saving}
            onClick={() =>
              setExerciseIndex((current) =>
                Math.min(selectedTemplate.exercises.length - 1, current + 1),
              )
            }
            type="button"
          >
            Next
          </Button>
        )}
      </div>

      {message ? <p className="text-sm text-zinc-400">{message}</p> : null}
    </div>
  );
}
