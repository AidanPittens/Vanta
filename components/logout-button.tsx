"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

type LogoutButtonProps = Omit<ComponentPropsWithoutRef<typeof Button>, "onClick">;

export function LogoutButton({ children = "Logout", ...props }: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <Button onClick={logout} {...props}>
      {children}
    </Button>
  );
}
