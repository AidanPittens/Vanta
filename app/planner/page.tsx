import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function PlannerPage() {
  return (
    <PlaceholderPage
      title="Planner"
      description="Daily planning, upcoming blocks, and weekly structure will live here."
      cards={[
        {
          title: "Today Schedule",
          body: "No blocks planned",
          meta: "Today's timeline will appear here.",
        },
        {
          title: "Upcoming Blocks",
          body: "Placeholder",
          meta: "Future training, school, and recovery blocks.",
        },
        {
          title: "Replan",
          body: "Placeholder",
          meta: "Schedule adjustment tools will be added later.",
        },
      ]}
    />
  );
}
