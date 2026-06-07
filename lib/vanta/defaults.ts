export const defaultProfile = {
  name: "Aidan",
  calorie_target: 2900,
  protein_target: 125,
  carb_target: 438,
  fat_target: 78,
  current_weight: 155,
  goal: "Lean bulk: gain muscle while minimizing fat gain",
};

export const workoutTemplates = [
  {
    name: "Push",
    sort_order: 1,
    exercises: [
      "Pec Deck",
      "Incline DB Press",
      "Machine Lateral Raise",
      "Top-Half Shoulder Press",
      "Triceps Pushdown",
      "JM Press",
      "Machine Crunches",
    ],
  },
  {
    name: "Pull",
    sort_order: 2,
    exercises: [
      "Lat Pulldown",
      "Single-Arm DB Preacher Curl",
      "T-Bar Row",
      "Close-Grip Chest-Supported Row",
      "Cable Reverse Curl",
    ],
  },
  {
    name: "Legs",
    sort_order: 3,
    exercises: [
      "Hack Squat",
      "Leg Extension",
      "Seated Hamstring Curl",
      "SLDL",
      "Calf Raises",
      "Seated Crunches",
      "Seated Oblique Crunches",
    ],
  },
  {
    name: "Upper",
    sort_order: 4,
    exercises: [
      "Pec Deck",
      "Incline DB Press",
      "Lat Pulldown",
      "Single-Arm DB Preacher Curl",
      "T-Bar Row",
      "Machine Lateral Raise",
      "Top-Half Shoulder Press",
      "Triceps Pushdown",
    ],
  },
  {
    name: "Lower",
    sort_order: 5,
    exercises: [
      "Hack Squat",
      "Leg Extension",
      "Seated Hamstring Curl",
      "SLDL",
      "Calf Raises",
      "Seated Crunches",
      "Seated Oblique Crunches",
    ],
  },
];

export const courses = [
  {
    course_code: "MATH 218",
    course_name: "Differential Equations for Engineers",
    priority_level: 1,
    uses_lecture_tracking: true,
    notes: "Highest priority because it has exam-like quizzes.",
  },
  {
    course_code: "CHE 231",
    course_name: "Physical Chemistry 2",
    priority_level: 2,
    uses_lecture_tracking: true,
    notes: null,
  },
  {
    course_code: "CHE 211",
    course_name: "Fluid Mechanics",
    priority_level: 2,
    uses_lecture_tracking: true,
    notes: null,
  },
  {
    course_code: "CHE 225",
    course_name: "Strategies for Process Improvement and Product Development",
    priority_level: 3,
    uses_lecture_tracking: true,
    notes: null,
  },
  {
    course_code: "CHE 241",
    course_name: "Materials Science and Engineering",
    priority_level: 3,
    uses_lecture_tracking: true,
    notes: null,
  },
  {
    course_code: "CHE 291",
    course_name: "Chemical Engineering Lab 2",
    priority_level: 2,
    uses_lecture_tracking: false,
    notes: "Lab tracking only. Group Y.",
  },
];

type LectureProgressDefault = {
  course_code: string;
  lecture_label: string;
  topic: string | null;
  learned: boolean;
  notes_written: boolean;
  practice_completed: boolean;
  reviewed: boolean;
};

type SchoolEventDefault = {
  course_code: string;
  title: string;
  event_type: string;
  date: string;
  time?: string | null;
  location?: string | null;
  submission_method?: string | null;
  priority: "low" | "medium" | "high";
  status?: string | null;
  notes?: string | null;
};

export const lectureProgress: LectureProgressDefault[] = [
  ...Array.from({ length: 6 }, (_, index) => ({
    course_code: "MATH 218",
    lecture_label: `Lecture ${index + 1}`,
    topic: null,
    learned: true,
    notes_written: false,
    practice_completed: false,
    reviewed: false,
  })),
  {
    course_code: "CHE 231",
    lecture_label: "Week 1 Part 1",
    topic: null,
    learned: true,
    notes_written: false,
    practice_completed: false,
    reviewed: false,
  },
  {
    course_code: "CHE 241",
    lecture_label: "Chapter 1",
    topic: null,
    learned: true,
    notes_written: false,
    practice_completed: false,
    reviewed: false,
  },
];

export const schoolEvents: SchoolEventDefault[] = [
  {
    course_code: "MATH 218",
    title: "Quiz 3",
    date: "2026-06-12",
    event_type: "quiz",
    priority: "high",
  },
  {
    course_code: "MATH 218",
    title: "Midterm",
    date: "2026-06-26",
    time: "10:30-12:20",
    location: "MC 1085",
    event_type: "midterm",
    priority: "high",
  },
  {
    course_code: "MATH 218",
    title: "Quiz 4",
    date: "2026-07-10",
    event_type: "quiz",
    priority: "high",
  },
  {
    course_code: "MATH 218",
    title: "Quiz 5",
    date: "2026-07-24",
    event_type: "quiz",
    priority: "high",
  },
  {
    course_code: "MATH 218",
    title: "Quiz 6",
    date: "2026-07-31",
    event_type: "quiz",
    priority: "high",
  },
  {
    course_code: "CHE 225",
    title: "Assignment 2",
    date: "2026-06-13",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 225",
    title: "Assignment 3",
    date: "2026-06-27",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 225",
    title: "Midterm",
    date: "2026-07-03",
    time: "13:30-15:30",
    location: "E2-1792",
    event_type: "midterm",
    priority: "high",
  },
  {
    course_code: "CHE 225",
    title: "Assignment 4",
    date: "2026-07-18",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 225",
    title: "Assignment 5",
    date: "2026-08-04",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 231",
    title: "Assignment",
    date: "2026-06-19",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 231",
    title: "Midterm",
    date: "2026-06-24",
    event_type: "midterm",
    priority: "high",
  },
  {
    course_code: "CHE 231",
    title: "Assignment",
    date: "2026-07-10",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 231",
    title: "Assignment",
    date: "2026-07-24",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 231",
    title: "Assignment",
    date: "2026-08-06",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 211",
    title: "Homework",
    date: "2026-06-18",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 211",
    title: "Midterm",
    date: "2026-06-25",
    time: "13:30-15:20",
    location: "E6-2024",
    event_type: "midterm",
    priority: "high",
  },
  {
    course_code: "CHE 211",
    title: "Homework",
    date: "2026-07-02",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 211",
    title: "Homework",
    date: "2026-07-16",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 211",
    title: "Homework",
    date: "2026-07-30",
    event_type: "assignment",
    priority: "low",
  },
  {
    course_code: "CHE 241",
    title: "Midterm",
    date: "2026-06-23",
    event_type: "midterm",
    priority: "high",
  },
  {
    course_code: "CHE 241",
    title: "Project Slides",
    date: "2026-07-21",
    time: "23:59",
    location: "LEARN",
    submission_method: "LEARN",
    event_type: "project",
    priority: "medium",
  },
  {
    course_code: "CHE 291",
    title: "Exp 5 Python Data Fitting",
    date: "2026-06-10",
    event_type: "lab",
    priority: "high",
  },
  {
    course_code: "CHE 291",
    title: "Exp 2 Distillation Column Report Due",
    date: "2026-06-17",
    time: "23:59",
    location: "LEARN",
    submission_method: "LEARN",
    event_type: "lab_report",
    priority: "medium",
  },
  {
    course_code: "CHE 291",
    title: "Exp 4 Prelab Proposal Due",
    date: "2026-06-22",
    time: "23:59",
    location: "LEARN",
    submission_method: "LEARN",
    event_type: "lab_report",
    priority: "high",
  },
  {
    course_code: "CHE 291",
    title: "Exp 4 3-Component Phase Diagram",
    date: "2026-06-24",
    event_type: "lab",
    priority: "high",
  },
  {
    course_code: "CHE 291",
    title: "Exp 4 Report Due",
    date: "2026-07-08",
    time: "23:59",
    location: "LEARN",
    submission_method: "LEARN",
    event_type: "lab_report",
    priority: "medium",
  },
  {
    course_code: "CHE 291",
    title: "Exp 3 Liquid-Vapour Equilibrium",
    date: "2026-07-08",
    event_type: "lab",
    priority: "high",
  },
  {
    course_code: "CHE 291",
    title: "Exp 6 Python Modelling VLEs",
    date: "2026-07-15",
    event_type: "lab",
    priority: "high",
  },
  {
    course_code: "CHE 291",
    title: "Exp 3 Report Due",
    date: "2026-07-22",
    time: "23:59",
    location: "LEARN",
    submission_method: "LEARN",
    event_type: "lab_report",
    priority: "medium",
  },
  {
    course_code: "CHE 291",
    title: "Exp 6 Group Report Due",
    date: "2026-07-29",
    time: "23:59",
    location: "LEARN",
    submission_method: "LEARN",
    event_type: "lab_report",
    priority: "medium",
  },
  {
    course_code: "CHE 291",
    title: "CHE 291 Lab Test",
    date: "2026-08-05",
    time: "09:30-11:00",
    location: "WEEF LAB E2-1792",
    event_type: "lab_test",
    priority: "high",
  },
];

export const progressionRule =
  "Increase weight only after hitting 8 reps on both working sets for 2 successful sessions at 1-2 RIR.";
