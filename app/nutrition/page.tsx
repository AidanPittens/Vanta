import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function NutritionPage() {
  return (
    <PlaceholderPage
      title="Nutrition"
      description="Meals, calories, protein, and nutrition targets will live here."
      cards={[
        {
          title: "Calories",
          body: "0 / 2900",
          meta: "Daily intake target.",
        },
        {
          title: "Protein",
          body: "0 / 125g",
          meta: "Daily protein target.",
        },
        {
          title: "Saved Meals",
          body: "Placeholder",
          meta: "Reusable meals will appear here.",
        },
      ]}
    />
  );
}
