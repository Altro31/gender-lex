"use client"

import { GalleryVerticalEnd, PanelLeftIcon } from "lucide-react"

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar"
import * as React from "react"

export function Logo() {
	const { toggleSidebar, state } = useSidebar()
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					onClick={toggleSidebar}
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
						{state === "collapsed" ? (
							<PanelLeftIcon className="size-4" />
						) : (
							<GalleryVerticalEnd className="size-4" />
						)}
					</div>
					<div className="flex flex-col gap-0.5 leading-none">
						<span className="font-medium">GenderLex</span>
						<span className="">v1.0.0</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
