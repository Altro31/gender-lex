import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"

import DropdownMenuResponsive from "@/components/app-sidebar/components/dropdown-menu-responsive"
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
import Link from "next/link"

export default async function NavRecent() {
	const t = await getTranslations()
	const { data } = await findRecentAnalyses()

	return (
		!!data?.data?.length && (
			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarGroupLabel>{t("Commons.recent")}</SidebarGroupLabel>
				<SidebarMenu>
					{data?.data.map((item) => (
						<SidebarMenuItem key={item.id}>
							<SidebarMenuButton asChild>
								<Link href={`/analysis/${item.id}`}>
									{item.attributes.name}
								</Link>
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
									analysis={item}
								/>
							</AlertDialog>
						</SidebarMenuItem>
					))}
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="text-sidebar-foreground/70"
						>
							<Link href="/analysis">
								<MoreHorizontal className="text-sidebar-foreground/70" />
								<span>{t("Commons.more")}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		)
	)
}
