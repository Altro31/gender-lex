"use client";

import { Badge } from "@/components/ui/badge";
import { t } from "@lingui/core/macro";

interface Props {
  contextKey: string;
}

export default function FloatingChatbotContextIndicator({ contextKey }: Props) {
  const handleMouseEnter = () => {
    const contextElement = document.getElementById(contextKey ?? "");
    if (!contextElement) return;
    contextElement.dataset.context = "";
  };
  const handleMouseLeave = () => {
    const contextElement = document.getElementById(contextKey ?? "");
    if (!contextElement) return;
    delete contextElement.dataset.context;
  };
  return (
    <Badge
      variant="outline"
      className="h-6.5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {t`context attached`}
    </Badge>
  );
}
