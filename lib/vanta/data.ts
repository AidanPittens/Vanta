import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import {
  courses,
  defaultProfile,
  lectureProgress,
  progressionRule,
  schoolEvents,
  workoutTemplates,
} from "@/lib/vanta/defaults";

type Db = SupabaseClient;

type SetupResult = {
  inserted: boolean;
  warnings: string[];
};

export type VantaProfile = typeof defaultProfile & {
  id?: string;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  sort_order?: number | null;
  order_index?: number | null;
  exercises: WorkoutExercise[];
};

export type WorkoutExercise = {
  id?: string;
  template_id?: string;
  name: string;
  sort_order?: number | null;
  order_index?: number | null;
  sets?: number | null;
  reps?: string | null;
  rep_min?: number | null;
  rep_max?: number | null;
  progression_target_reps?: number | null;
  rir?: string | null;
  target_rir_min?: number | null;
  target_rir_max?: number | null;
  single_arm?: boolean | null;
  is_single_arm?: boolean | null;
  notes?: string | null;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  priority_level: number;
  uses_lecture_tracking: boolean;
  notes?: string | null;
};

export type LectureProgress = {
  id?: string;
  course_id?: string;
  title: string;
  learned: boolean;
  notes_written: boolean;
  practice_completed: boolean;
  courses?: Pick<Course, "code" | "name"> | null;
};

export type SchoolEvent = {
  id?: string;
  course_id?: string;
  title: string;
  due_date: string;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  event_type: string;
  priority: "low" | "medium" | "high";
  courses?: Pick<Course, "code" | "name"> | null;
};

export type VantaData = {
  userId: string;
  profile: VantaProfile | null;
  templates: WorkoutTemplate[];
  courses: Course[];
  lectureProgress: LectureProgress[];
  highPriorityEvents: SchoolEvent[];
  initialized: boolean;
  setupErrors: string[];
};

function exerciseDefaults(name: string, sortOrder: number) {
  const singleArm = name === "Single-Arm DB Preacher Curl";

  return {
    name,
    order_index: sortOrder,
    sets: 2,
    rep_min: 4,
    rep_max: 9,
    progression_target_reps: 8,
    target_rir_min: 1,
    target_rir_max: 2,
    is_single_arm: singleArm,
    notes: singleArm ? "2 sets per arm" : null,
  };
}

function errorMessage(scope: string, error: { message?: string }) {
  return `${scope}: ${error.message ?? "unknown Supabase error"}`;
}

function setupResult(): SetupResult {
  return { inserted: false, warnings: [] };
}

function firstRow<T>(data: T[] | null) {
  return data?.[0] ?? null;
}

async function ensureProfile(supabase: Db, userId: string) {
  const result = setupResult();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .limit(1);

  if (error) {
    result.warnings.push(errorMessage("profiles select", error));
    return result;
  }

  if (firstRow(data)) {
    return result;
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: userId,
    ...defaultProfile,
  });

  if (insertError) {
    result.warnings.push(errorMessage("profiles insert", insertError));
    return result;
  }

  result.inserted = true;
  return result;
}

async function ensureNutritionTarget(supabase: Db, userId: string) {
  const result = setupResult();
  const { data, error } = await supabase
    .from("nutrition_targets")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (error) {
    result.warnings.push(errorMessage("nutrition_targets select", error));
    return result;
  }

  if (firstRow(data)) {
    return result;
  }

  const { error: insertError } = await supabase.from("nutrition_targets").insert({
    user_id: userId,
    calories: defaultProfile.calorie_target,
    protein: defaultProfile.protein_target,
    carbs: defaultProfile.carb_target,
    fat: defaultProfile.fat_target,
  });

  if (insertError) {
    result.warnings.push(errorMessage("nutrition_targets insert", insertError));
    return result;
  }

  result.inserted = true;
  return result;
}

async function ensureWorkoutTemplates(supabase: Db, userId: string) {
  const result = setupResult();

  for (const template of workoutTemplates) {
    const { data: existingTemplate, error } = await supabase
      .from("workout_templates")
      .select("id")
      .eq("user_id", userId)
      .eq("name", template.name)
      .limit(1);

    if (error) {
      result.warnings.push(errorMessage(`workout_templates ${template.name} select`, error));
      continue;
    }

    let templateId = firstRow(existingTemplate)?.id as string | undefined;

    if (!templateId) {
      const { data: newTemplate, error: insertError } = await supabase
        .from("workout_templates")
        .insert({
          user_id: userId,
          name: template.name,
          order_index: template.sort_order,
          progression_rule: progressionRule,
          current_context: null,
        })
        .select("id")
        .single();

      if (insertError) {
        result.warnings.push(errorMessage(`workout_templates ${template.name} insert`, insertError));
        continue;
      }

      templateId = newTemplate.id;
      result.inserted = true;
    }

    if (!templateId) {
      result.warnings.push(`workout_templates ${template.name} did not return an id`);
      continue;
    }

    for (const [index, exerciseName] of template.exercises.entries()) {
      const { data: existingExercise, error: exerciseError } = await supabase
        .from("workout_template_exercises")
        .select("id")
        .eq("template_id", templateId)
        .eq("name", exerciseName)
        .limit(1);

      if (exerciseError) {
        result.warnings.push(errorMessage(`${template.name} ${exerciseName} select`, exerciseError));
        continue;
      }

      if (firstRow(existingExercise)) {
        continue;
      }

      const { error: insertExerciseError } = await supabase
        .from("workout_template_exercises")
        .insert({
          user_id: userId,
          template_id: templateId,
          ...exerciseDefaults(exerciseName, index + 1),
        });

      if (insertExerciseError) {
        result.warnings.push(errorMessage(`${template.name} ${exerciseName} insert`, insertExerciseError));
        continue;
      }

      result.inserted = true;
    }
  }

  return result;
}

async function getCourseIds(supabase: Db, userId: string) {
  const courseIds = new Map<string, string>();
  const { data, error } = await supabase
    .from("courses")
    .select("id, code")
    .eq("user_id", userId);

  if (error) {
    return { courseIds, warnings: [errorMessage("courses id lookup", error)] };
  }

  for (const course of (data ?? []) as Pick<Course, "id" | "code">[]) {
    courseIds.set(course.code, course.id);
  }

  return { courseIds, warnings: [] };
}

async function ensureCourses(supabase: Db, userId: string): Promise<
  SetupResult & {
    courseIds: Map<string, string>;
  }
> {
  const result = setupResult();

  for (const course of courses) {
    const { data: existingCourse, error } = await supabase
      .from("courses")
      .select("id")
      .eq("user_id", userId)
      .eq("code", course.code)
      .limit(1);

    if (error) {
      result.warnings.push(errorMessage(`courses ${course.code} select`, error));
      continue;
    }

    let courseId = firstRow(existingCourse)?.id as string | undefined;

    if (!courseId) {
      const { data: newCourse, error: insertError } = await supabase
        .from("courses")
        .insert({
          user_id: userId,
          ...course,
        })
        .select("id")
        .single();

      if (insertError) {
        result.warnings.push(errorMessage(`courses ${course.code} insert`, insertError));
        continue;
      }

      courseId = newCourse.id;
      result.inserted = true;
    }

  }

  const lookup = await getCourseIds(supabase, userId);

  return {
    ...result,
    warnings: [...result.warnings, ...lookup.warnings],
    courseIds: lookup.courseIds,
  };
}

async function ensureLectureProgress(
  supabase: Db,
  userId: string,
  courseIds: Map<string, string>,
) {
  const result = setupResult();
  const missingCourseCodes = new Set<string>();

  for (const progress of lectureProgress) {
    const courseId = courseIds.get(progress.course_code);

    if (!courseId) {
      missingCourseCodes.add(progress.course_code);
      continue;
    }

    const { data, error } = await supabase
      .from("lecture_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("title", progress.title)
      .limit(1);

    if (error) {
      result.warnings.push(errorMessage(`${progress.course_code} ${progress.title} select`, error));
      continue;
    }

    if (firstRow(data)) {
      continue;
    }

    const row = {
      title: progress.title,
      learned: progress.learned,
      notes_written: progress.notes_written,
      practice_completed: progress.practice_completed,
    };
    const { error: insertError } = await supabase.from("lecture_progress").insert({
      user_id: userId,
      course_id: courseId,
      ...row,
    });

    if (insertError) {
      result.warnings.push(errorMessage(`${progress.course_code} ${progress.title} insert`, insertError));
      continue;
    }

    result.inserted = true;
  }

  if (missingCourseCodes.size > 0) {
    result.warnings.push(
      `lecture_progress skipped missing courses: ${Array.from(missingCourseCodes).join(", ")}`,
    );
  }

  return result;
}

async function ensureSchoolEvents(
  supabase: Db,
  userId: string,
  courseIds: Map<string, string>,
) {
  const result = setupResult();
  const missingCourseCodes = new Set<string>();

  for (const event of schoolEvents) {
    const courseId = courseIds.get(event.course_code);

    if (!courseId) {
      missingCourseCodes.add(event.course_code);
      continue;
    }

    const { data, error } = await supabase
      .from("school_events")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("title", event.title)
      .eq("due_date", event.due_date)
      .limit(1);

    if (error) {
      result.warnings.push(errorMessage(`${event.course_code} ${event.title} select`, error));
      continue;
    }

    if (firstRow(data)) {
      continue;
    }

    const row = {
      title: event.title,
      due_date: event.due_date,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      event_type: event.event_type,
      priority: event.priority,
    };
    const { error: insertError } = await supabase.from("school_events").insert({
      user_id: userId,
      course_id: courseId,
      ...row,
    });

    if (insertError) {
      result.warnings.push(errorMessage(`${event.course_code} ${event.title} insert`, insertError));
      continue;
    }

    result.inserted = true;
  }

  if (missingCourseCodes.size > 0) {
    result.warnings.push(
      `school_events skipped missing courses: ${Array.from(missingCourseCodes).join(", ")}`,
    );
  }

  return result;
}

async function ensureVantaDefaults(supabase: Db, userId: string) {
  const setupErrors: string[] = [];
  let initialized = false;
  let courseIds = new Map<string, string>();

  async function runSection<T extends SetupResult>(
    name: string,
    setup: () => Promise<T>,
  ) {
    try {
      const result = await setup();
      initialized = result.inserted || initialized;
      setupErrors.push(...result.warnings.map((warning) => `${name}: ${warning}`));
      return result;
    } catch (error) {
      setupErrors.push(
        `${name}: ${error instanceof Error ? error.message : "Unknown setup error"}`,
      );
      return null;
    }
  }

  await runSection("profile", () => ensureProfile(supabase, userId));
  await runSection("workout templates", () => ensureWorkoutTemplates(supabase, userId));
  await runSection("nutrition target", () => ensureNutritionTarget(supabase, userId));

  const coursesResult = await runSection("courses", () => ensureCourses(supabase, userId));
  if (coursesResult) {
    courseIds = coursesResult.courseIds;
  } else {
    const lookup = await getCourseIds(supabase, userId);
    courseIds = lookup.courseIds;
    setupErrors.push(...lookup.warnings.map((warning) => `courses: ${warning}`));
  }

  if (courseIds.size === 0) {
    const lookup = await getCourseIds(supabase, userId);
    courseIds = lookup.courseIds;
    setupErrors.push(...lookup.warnings.map((warning) => `courses: ${warning}`));
  }

  await runSection("school events", () => ensureSchoolEvents(supabase, userId, courseIds));
  await runSection("lecture progress", () =>
    ensureLectureProgress(supabase, userId, courseIds),
  );

  return { initialized, setupErrors };
}

async function getProfile(supabase: Db, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return data as VantaProfile | null;
}

async function getWorkoutTemplates(supabase: Db, userId: string) {
  const { data: templates } = await supabase
    .from("workout_templates")
    .select("*")
    .eq("user_id", userId)
    .order("order_index", { ascending: true });

  const rows = (templates ?? []) as WorkoutTemplate[];
  const templateIds = rows.map((template) => template.id);

  if (templateIds.length === 0) {
    return [];
  }

  const { data: exercises } = await supabase
    .from("workout_template_exercises")
    .select("*")
    .in("template_id", templateIds)
    .order("order_index", { ascending: true });

  const exercisesByTemplate = new Map<string, WorkoutExercise[]>();

  for (const exercise of (exercises ?? []) as WorkoutExercise[]) {
    if (!exercise.template_id) {
      continue;
    }

    const current = exercisesByTemplate.get(exercise.template_id) ?? [];
    current.push(exercise);
    exercisesByTemplate.set(exercise.template_id, current);
  }

  return rows.map((template) => ({
    ...template,
    exercises: exercisesByTemplate.get(template.id) ?? [],
  }));
}

async function getCourses(supabase: Db, userId: string) {
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("user_id", userId)
    .order("priority_level", { ascending: true });

  return (data ?? []) as Course[];
}

async function getLectureProgress(supabase: Db, userId: string) {
  const { data } = await supabase
    .from("lecture_progress")
    .select("*, courses(code, name)")
    .eq("user_id", userId)
    .order("title", { ascending: true });

  return (data ?? []) as LectureProgress[];
}

async function getHighPriorityEvents(supabase: Db, userId: string) {
  const { data } = await supabase
    .from("school_events")
    .select("*, courses(code, name)")
    .eq("user_id", userId)
    .eq("priority", "high")
    .gte("due_date", "2026-06-06")
    .order("due_date", { ascending: true })
    .limit(10);

  return (data ?? []) as SchoolEvent[];
}

export async function getVantaData(): Promise<VantaData> {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { initialized, setupErrors } = await ensureVantaDefaults(supabase, user.id);
  const [profile, templates, courseRows, progress, events] = await Promise.all([
    getProfile(supabase, user.id),
    getWorkoutTemplates(supabase, user.id),
    getCourses(supabase, user.id),
    getLectureProgress(supabase, user.id),
    getHighPriorityEvents(supabase, user.id),
  ]);

  return {
    userId: user.id,
    profile,
    templates,
    courses: courseRows,
    lectureProgress: progress,
    highPriorityEvents: events,
    initialized,
    setupErrors,
  };
}
