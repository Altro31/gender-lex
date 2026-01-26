"use client";

import LastUsedBadge from "@/components/last-used-badge";
import { useLastLoginMethod } from "@/lib/auth/auth-client";
import { Button, mergeProps } from "@base-ui/react";
import { t } from "@lingui/core/macro";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export default function EmailButton(props: Button.Props) {
  const [method] = useLastLoginMethod();

  return (
    <Button
      {...mergeProps<typeof Button>(
        { render: <Link href="/auth/login" />, nativeButton: false },
        props
      )}
    >
      <UserIcon />
      {t`Email`}
      {method === "email" && (
        <LastUsedBadge variant="inline" className="ml-auto" />
      )}
    </Button>
  );
}
