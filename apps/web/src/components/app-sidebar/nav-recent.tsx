import { MoreHorizontal } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DeleteAnalysisAlertDialog } from "@/sections/analysis/components/dialogs/delete-analysis-alert-dialog";
import { findRecentAnalyses } from "@/services/analysis";

import { AnalysisActions } from "@/sections/analysis/components/analysis-actions";
import { t } from "@lingui/core/macro";
import Link from "next/link";
import { getSession } from "@/lib/auth/auth-server";

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
                  render={<Link href={`/analysis/${item.id}`} />}
                >
                  {item.name}
                </SidebarMenuButton>
                <AnalysisActions
                  analysis={item}
                  renderTrigger={
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">{t`More`}</span>
                    </SidebarMenuAction>
                  }
                />
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
