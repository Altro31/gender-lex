import { MoreHorizontal } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DeleteAnalysisAlertDialog } from "@/sections/analysis/components/dialogs/delete-analysis-alert-dialog";
import { findRecentAnalyses } from "@/services/analysis";

import { getSession } from "@/lib/auth/auth-server";
import { t } from "@lingui/core/macro";
import Link from "next/link";
import NavRecentAnalysisAction from "./nav-recent-analysis-action";

export default async function NavRecent() {
  const session = await getSession();
  if (!session) return null;

  const data = await findRecentAnalyses();

  return (
    Boolean(data.length) && (
      <>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>{t`Recent`}</SidebarGroupLabel>
          <SidebarMenu>
            {data.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  className="h-auto"
                  render={<Link href={`/analysis/${item.id}`} />}
                >
                  {item.name}
                </SidebarMenuButton>
                <NavRecentAnalysisAction item={item} />
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/analysis" />}
                className="text-sidebar-foreground/70"
              >
                <MoreHorizontal className="stroke-sidebar-foreground/70" />
                <span>{t`More`}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <DeleteAnalysisAlertDialog />
      </>
    )
  );
}
