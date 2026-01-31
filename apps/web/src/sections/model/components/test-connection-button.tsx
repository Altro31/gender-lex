import { Button } from "@/components/ui/button";
import { getApiProxyClient } from "@/lib/api/proxy-client";
import { handleStream } from "@/lib/api/util";
import { ButtonProps, mergeProps } from "@base-ui/react";
import { t } from "@lingui/core/macro";
import type { Model } from "@repo/db/models";
import type { ModelApp } from "@repo/types/api";
import { useTransition } from "react";

interface Props extends ButtonProps {
  id: string;
  onUpdate?: (model: Model) => void;
}

const client = getApiProxyClient<ModelApp>();

export default function TestConnectionButton({
  id,
  onUpdate,
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleTest = () =>
    startTransition(async () => {
      const stream = await handleStream(
        client.model[":id"]["test-connection"].stream.$post({ param: { id } })
      );
      for await (const update of stream) {
        onUpdate?.(update.data);
      }
    });

  return (
    <Button
      {...mergeProps<typeof Button>(
        {
          variant: "outline",
          size: "sm",
          disabled: isPending,
          onClick: handleTest,
          className: "text-sm",
          children: t`Test Connection`,
        },
        props
      )}
      {...props}
    />
  );
}
