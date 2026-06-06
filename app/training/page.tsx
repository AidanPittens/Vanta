import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function TrainingPage() {
  return (
    <PlaceholderPage
      title="Training"
      description="Workout plans, exercise history, and performance notes will live here."
      cards={[
        {
          title: "Next Workout",
          body: "Lower",
          meta: "Next planned training focus.",
        },
        {
          title: "Workout Queue",
          body: "No queued sessions",
          meta: "Upcoming workouts will appear here.",
        },
        {
          title: "Log Workout",
          body: "Placeholder",
          meta: "Workout logging will be added after the shell is connected to data.",
        },
      ]}
    />
  );
}
