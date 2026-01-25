"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { Button as ButtonPrimitive, mergeProps } from "@base-ui/react";
import { LogOut } from "lucide-react";

export function LogoutButton({
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) {
  const logOut = async () => {
    await authClient.signOut();
    location.reload();
  };

  return (
    <Button {...mergeProps(props, { onClick: logOut })}>
      <LogOut />
      {children}
    </Button>
  );
}
