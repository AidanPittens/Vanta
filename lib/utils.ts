import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function hasValidSupabaseUrl(value?: string) {
  if (!value || value === "your-project-url") {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// This check can be removed once the project has real Supabase credentials.
export const hasEnvVars =
  hasValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !==
        "your-publishable-or-anon-key",
  );
