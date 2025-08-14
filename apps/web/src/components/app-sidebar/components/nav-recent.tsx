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
import DeleteAnalysisAlertDialog from "@/sections/analysis/components/delete-analysis-alert-dialog"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function NavRecent({
	projects,
}: {
	projects: {
		name: string
		url: string
	}[]
}) {
	const t = useTranslations()

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>{t("Commons.recent")}</SidebarGroupLabel>
			<SidebarMenu>
				{projects.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
							<Link href={item.url}>{item.name}</Link>
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
										<span>{t("Actions.view-details")}</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Edit className="text-muted-foreground" />
										<span>{t("Actions.edit")}</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<AlertDialogTrigger asChild>
										<DropdownMenuItem variant="destructive">
											<Trash2 className="text-muted-foreground" />
											<span>{t("Actions.delete")}</span>
										</DropdownMenuItem>
									</AlertDialogTrigger>
								</DropdownMenuResponsive>
							</DropdownMenu>
							<DeleteAnalysisAlertDialog model={null} />
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
}
