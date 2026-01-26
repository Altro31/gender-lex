"use client";

import LastUsedBadge from "@/components/last-used-badge";
import { authClient, useLastLoginMethod } from "@/lib/auth/auth-client";
import { Button, mergeProps } from "@base-ui/react";
import { SiGithub } from "@icons-pack/react-simple-icons";

interface Props extends Button.Props {
  redirect: string;
}

export default function GithubButton({ redirect, ...props }: Props) {
  const [method] = useLastLoginMethod();

  return (
    <Button
      {...mergeProps(
        {
          onClick: () => {
            authClient.signIn.social({
              provider: "github",
              callbackURL: redirect,
            });
          },
        },
        props
      )}
    >
      <SiGithub />
      Github
      {method === "github" && (
        <LastUsedBadge variant="inline" className="ml-auto" />
      )}
    </Button>
  );
}
