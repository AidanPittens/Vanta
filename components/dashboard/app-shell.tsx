"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Apple,
  CalendarDays,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Today", href: "/", icon: LayoutDashboard },
  { label: "Training", href: "/training", icon: Dumbbell },
  { label: "Nutrition", href: "/nutrition", icon: Apple },
  { label: "School", href: "/school", icon: GraduationCap },
  { label: "Recovery", href: "/recovery", icon: HeartPulse },
  { label: "Planner", href: "/planner", icon: CalendarDays },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#07090c] text-zinc-100">
      <div className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#090c11]/95 px-4 py-5 lg:block">
        <Link href="/" className="mb-8 flex items-center gap-3 px-2">
          <div className="grid size-9 place-items-center rounded-md border border-sky-300/25 bg-sky-300/10 text-sm font-semibold text-sky-100">
            V
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-white">
              VANTA
            </p>
            <p className="text-xs text-zinc-500">Personal command center</p>
          </div>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.04] hover:text-white",
                  active &&
                    "border border-sky-300/20 bg-sky-300/10 text-sky-100 shadow-[0_0_30px_rgba(56,189,248,0.08)]",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="min-h-screen pb-24 lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-md border border-sky-300/25 bg-sky-300/10 text-sm font-semibold text-sky-100">
                V
              </div>
              <p className="text-sm font-semibold tracking-[0.22em] text-white">
                VANTA
              </p>
            </Link>
            <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
              Today
            </div>
          </div>

          {children}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#090c11]/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-6 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-zinc-500",
                  active && "bg-sky-300/10 text-sky-100",
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
