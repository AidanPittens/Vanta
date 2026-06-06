import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function SchoolPage() {
  return (
    <PlaceholderPage
      title="School"
      description="Classes, practice blocks, assignments, and exam prep will live here."
      cards={[
        {
          title: "MATH 218 Priority",
          body: "Practice block",
          meta: "Primary academic focus for the day.",
        },
        {
          title: "Upcoming Deadlines",
          body: "No deadlines logged",
          meta: "Assignments and exams will appear here.",
        },
        {
          title: "Lecture Progress",
          body: "Placeholder",
          meta: "Course progress tracking will be added later.",
        },
      ]}
    />
  );
}
