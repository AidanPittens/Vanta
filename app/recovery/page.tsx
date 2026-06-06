import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function RecoveryPage() {
  return (
    <PlaceholderPage
      title="Recovery"
      description="Sleep, readiness, soreness, and recovery habits will live here."
      cards={[
        {
          title: "Sleep",
          body: "Not logged",
          meta: "Sleep duration and quality will appear here.",
        },
        {
          title: "Energy",
          body: "Not logged",
          meta: "Daily readiness check-in.",
        },
        {
          title: "Symptoms",
          body: "Not logged",
          meta: "Track soreness, illness, and other notes.",
        },
        {
          title: "Supplements",
          body: "Placeholder",
          meta: "Supplement reminders will appear here.",
        },
      ]}
    />
  );
}
