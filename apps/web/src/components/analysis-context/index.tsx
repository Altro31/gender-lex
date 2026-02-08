"use client";

import { Button } from "@/components/ui/button";
import { useChatbot } from "@/hooks/use-chatbot";
import { cn } from "@/lib/utils";
import { t } from "@lingui/core/macro";
import { Check, Stars } from "lucide-react";
import type React from "react";

interface Props {
  children: React.ReactElement;
  id: string;
  content: any;
}

export default function AnalysisContext({ children, content, id }: Props) {
  const { context } = useChatbot();
  const used = context.value?.key === id;
  const handleUseContext = () => context.set({ content, key: id });

  return (
    <div
      id={id}
      className="group/context relative data-context:*:ring-primary data-context:*:ring "
    >
      {children}
      <Button
        onClick={handleUseContext}
        disabled={used}
        className={cn(
          "size-7 hover:w-24 px-1.5 overflow-clip justify-end opacity-0 scale-0 group/button-context group-hover/context:opacity-100 group-hover/context:scale-100 absolute top-1 right-1 transition-all",
          used && "opacity-100 scale-100"
        )}
      >
        <span>{t`Contexto`}</span>
        {used ? <Check /> : <Stars />}
      </Button>
    </div>
  );
}
