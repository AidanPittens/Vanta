"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthControlProps = {
  compact?: boolean;
  className?: string;
};

export function AuthControl({ compact = false, className }: AuthControlProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (!active) {
        return;
      }

      setEmail(data.user?.email ?? null);
      setLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
      setLoaded(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!loaded) {
    return (
      <div
        className={cn(
          "h-11 rounded-md border border-white/10 bg-white/[0.02]",
          className,
        )}
      />
    );
  }

  if (!email) {
    return (
      <Link
        href="/auth/login"
        className={cn(
          "flex h-11 items-center gap-3 rounded-md border border-sky-300/20 bg-sky-300/10 px-3 text-sm font-medium text-sky-100 transition hover:bg-sky-300/15 hover:text-white",
          compact && "h-9 justify-center px-3 text-xs",
          className,
        )}
      >
        <LogIn className="size-4" />
        Sign in
      </Link>
    );
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="max-w-[150px] truncate text-xs text-zinc-400">
          {email}
        </span>
        <LogoutButton
          variant="ghost"
          size="sm"
          className="border border-white/10 bg-white/[0.02] text-zinc-400 hover:bg-white/[0.04] hover:text-white"
        >
          <LogOut className="size-4" />
          Logout
        </LogoutButton>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border border-white/10 bg-white/[0.02] p-3",
        className,
      )}
    >
      <p className="truncate text-xs text-zinc-500">{email}</p>
      <LogoutButton
        variant="ghost"
        className="mt-3 h-10 w-full justify-start px-0 text-zinc-400 hover:bg-transparent hover:text-white"
      >
        <LogOut className="size-4" />
        Logout
      </LogoutButton>
    </div>
  );
}
