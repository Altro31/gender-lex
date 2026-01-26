"use client";

import LastUsedBadge from "@/components/last-used-badge";
import { authClient, useLastLoginMethod } from "@/lib/auth/auth-client";
import { Button, mergeProps } from "@base-ui/react";
import { SiGoogle } from "@icons-pack/react-simple-icons";

interface Props extends Button.Props {
  redirect: string;
}

export default function GoogleButton({ redirect, ...props }: Props) {
  const [method] = useLastLoginMethod();
  return (
    <Button
      {...mergeProps(
        {
          onClick: () => {
            authClient.signIn.social({
              provider: "google",
              callbackURL: redirect,
            });
          },
        },
        props
      )}
    >
      <SiGoogle />
      Google
      {method === "google" && (
        <LastUsedBadge variant="inline" className="ml-auto" />
      )}
    </Button>
  );
}
