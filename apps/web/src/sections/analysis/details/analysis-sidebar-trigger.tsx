"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useEffectEvent } from "react";

export default function AnalysisSidebarTrigger() {
  const sidebar = useSidebar();
  const sidebarEffect = useEffectEvent(() => sidebar.setOpen(false));

  useEffect(() => {
    sidebarEffect();
    // oxlint-disable-next-line exhaustive-deps
  }, []);

  return null;
}
