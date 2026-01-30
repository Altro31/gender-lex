"use client";

import { AnalysisActions } from "@/sections/analysis/components/analysis-actions";
import { Analysis } from "@repo/db/models";
import { SidebarMenuAction } from "../ui/sidebar";
import { MoreHorizontal } from "lucide-react";
import { t } from "@lingui/core/macro";
import type { findRecentAnalyses } from "@/services/analysis";

interface Props {
  item: findRecentAnalyses["Item"];
}

export default function NavRecentAnalysisAction({ item }: Props) {
  return (
    <AnalysisActions
      analysis={item}
      renderTrigger={
        <SidebarMenuAction showOnHover>
          <MoreHorizontal />
          <span className="sr-only">{t`More`}</span>
        </SidebarMenuAction>
      }
    />
  );
}
