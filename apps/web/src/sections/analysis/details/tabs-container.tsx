"use client";

import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { parseAsString, useQueryState } from "nuqs";

export default function TabsContainer({
  className,
  ...props
}: React.ComponentProps<typeof Tabs>) {
  const [tab, setTab] = useQueryState(
    "section",
    parseAsString.withDefault("overview"),
  );
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value)}
      className={cn("space-y-6", className)}
      {...props}
    />
  );
}
