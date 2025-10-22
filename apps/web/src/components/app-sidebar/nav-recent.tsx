import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"

import DropdownMenuResponsive from "@/components/app-sidebar/dropdown-menu-responsive"
import NavLink from "@/components/app-sidebar/nav-link"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import DeleteAnalysisAlertDialogContent from "@/sections/analysis/components/delete-analysis-alert-dialog-content"
import { findRecentAnalyses } from "@/services/analysis"
import { getTranslations } from "next-intl/server"

export default async function NavRecent() {
	const t = await getTranslations()
	const data = await findRecentAnalyses()

	return (
		Boolean(data.length) && (
			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarGroupLabel>{t("Commons.recent")}</SidebarGroupLabel>
				<SidebarMenu>
					{data.map((item) => (
						<SidebarMenuItem key={item.id}>
							<SidebarMenuButton>
								<NavLink href={`/analysis/${item.id}`}>
									{item.name}
								</NavLink>
							</SidebarMenuButton>
							<AlertDialog>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuAction showOnHover>
											<MoreHorizontal />
											<span className="sr-only">
												{t("Commons.more")}
											</span>
										</SidebarMenuAction>
									</DropdownMenuTrigger>
									<DropdownMenuResponsive>
										<DropdownMenuItem>
											<Eye className="text-muted-foreground" />
											<span>
												{t("Actions.view-details")}
											</span>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Edit className="text-muted-foreground" />
											<span>{t("Actions.edit")}</span>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<AlertDialogTrigger asChild>
											<DropdownMenuItem variant="destructive">
												<Trash2 className="text-muted-foreground" />
												<span>
													{t("Actions.delete")}
												</span>
											</DropdownMenuItem>
										</AlertDialogTrigger>
									</DropdownMenuResponsive>
								</DropdownMenu>
								<DeleteAnalysisAlertDialogContent
									analysis={item as any}
								/>
							</AlertDialog>
						</SidebarMenuItem>
					))}
					<SidebarMenuItem>
						<SidebarMenuButton className="text-sidebar-foreground/70">
							<NavLink href="/analysis">
								<MoreHorizontal className="text-sidebar-foreground/70" />
								<span>{t("Commons.more")}</span>
							</NavLink>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		)
	)
}
