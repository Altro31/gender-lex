"use client"

import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"

import {
	DropdownMenu,
	DropdownMenuContent,
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
	useSidebar,
} from "@/components/ui/sidebar"
import DeleteAnalysisAlertDialog from "@/sections/analysis/components/delete-analysis-alert-dialog"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from "next/link"

export default function NavRecent({
	projects,
}: {
	projects: {
		name: string
		url: string
	}[]
}) {
	const { isMobile } = useSidebar()

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Recent</SidebarGroupLabel>
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
										<span className="sr-only">More</span>
									</SidebarMenuAction>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-48 rounded-lg"
									side={isMobile ? "bottom" : "right"}
									align={isMobile ? "end" : "start"}
								>
									<DropdownMenuItem>
										<Eye className="text-muted-foreground" />
										<span>View details</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Edit className="text-muted-foreground" />
										<span>Edit</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<AlertDialogTrigger asChild>
										<DropdownMenuItem variant="destructive">
											<Trash2 className="text-muted-foreground" />
											<span>Delete</span>
										</DropdownMenuItem>
									</AlertDialogTrigger>
								</DropdownMenuContent>
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
							<span>More</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	)
}
