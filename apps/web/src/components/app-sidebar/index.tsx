import { Bot, Clock, Plus, Settings } from "lucide-react"
import * as React from "react"

import { Logo } from "@/components/app-sidebar/logo"
import { NavMain } from "@/components/app-sidebar/nav-main"
import NavRecent from "@/components/app-sidebar/nav-recent"
import NavUser from "@/components/app-sidebar/nav-user"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import { Suspense } from "react"

const data = {
	navMain: [
		{
			title: "sidebar.nav.new-analysis",
			url: "/",
			icon: <Plus />,
			isActive: true,
		},
		{
			title: "sidebar.nav.history",
			url: "/analysis",
			icon: <Clock />,
		},
		{
			title: "sidebar.nav.models",
			url: "/models",
			icon: <Bot />,
		},
		{
			title: "sidebar.nav.presets",
			url: "/presets",
			icon: <Settings />,
		},
	] satisfies {
		title: string
		url: string
		icon?: React.ReactNode
		isActive?: boolean
	}[],
}

export default async function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<Suspense>
					<NavRecent />
				</Suspense>
			</SidebarContent>
			<SidebarFooter>
				<Suspense>
					<NavUser />
				</Suspense>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
