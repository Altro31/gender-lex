import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"

import DropdownMenuResponsive from "@/components/app-sidebar/dropdown-menu-responsive"
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
import { useLingui } from "@lingui/react/macro"
import Link from "next/link"

export default async function NavRecent() {
	const { t } = useLingui()

	const data = await findRecentAnalyses()

	return (
		Boolean(data.length) && (
			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarGroupLabel>{t`Recent`}</SidebarGroupLabel>
				<SidebarMenu>
					{data.map((item) => (
						<SidebarMenuItem key={item.id}>
							<SidebarMenuButton asChild>
								<Link href={`/analysis/${item.id}`}>
									{item.name}
								</Link>
							</SidebarMenuButton>
							<AlertDialog>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuAction showOnHover>
											<MoreHorizontal />
											<span className="sr-only">
												{t`More`}
											</span>
										</SidebarMenuAction>
									</DropdownMenuTrigger>
									<DropdownMenuResponsive>
										<DropdownMenuItem>
											<Eye className="text-muted-foreground" />
											<span>{t`View details`}</span>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Edit className="text-muted-foreground" />
											<span>{t`Edit`}</span>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<AlertDialogTrigger asChild>
											<DropdownMenuItem variant="destructive">
												<Trash2 className="text-muted-foreground" />
												<span>{t`Delete`}</span>
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
						<SidebarMenuButton
							asChild
							className="text-sidebar-foreground/70"
						>
							<Link href="/analysis">
								<MoreHorizontal className="text-sidebar-foreground/70" />
								<span>{t`More`}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		)
	)
}
