import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { Button as ButtonPrimitive } from "@base-ui/react";
import { LogOut } from "lucide-react";

export function LogoutButton({
  children,
  disabled,
  ...props
}: Omit<ButtonPrimitive.Props, "onClick">) {
  const logOut = async () => {
    await authClient.signOut();
    location.reload();
  };

  return (
    <Button {...props} onClick={logOut}>
      <LogOut />
      {children}
    </Button>
  );
}
