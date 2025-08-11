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
import { Skeleton } from "@/components/ui/skeleton"

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
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
		},
		{
			name: "Sales & Marketing",
			url: "#",
		},
		{
			name: "Travel",
			url: "#",
		},
	],
}

export default function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent>
				<React.Suspense>
					<NavMain items={data.navMain} />
				</React.Suspense>
				<NavRecent projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<React.Suspense fallback={<Skeleton className="h-12 w-full" />}>
					<NavUser />
				</React.Suspense>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
