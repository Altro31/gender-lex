"use client";

import { useLocale } from "@/hooks/use-locale";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
  size?: keyof typeof sizes
}

const sizes = {
	xs: "text-xs",
	sm: "text-sm",
	default: "text-base",
}

export default function TermsAndConditions({ size = 'default' }: Props) {
  const locale = useLocale();
  return (
    <p className={cn(sizes[size])}>
      <Trans>
        By continuing, you accept our{" "}
        <Button
          size="xs"
          variant="link"
          nativeButton={false}
          className={cn("p-0",sizes[size])}
          render={<Link href={`/${locale}/terms`} />}
        >
          {t`Terms of service`}
        </Button>{" "}
        and{" "}
        <Button
          size="xs"
          
          variant="link"
          nativeButton={false}
		  className={cn("p-0",sizes[size])}

          render={<Link href={`/${locale}/privacy`} />}
        >
          {t`Privacy Policy`}
        </Button>
      </Trans>
    </p>
  );
}
