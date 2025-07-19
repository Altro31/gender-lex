import {
	Bot,
	Clock,
	Plus
} from "lucide-react"
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

// This is sample data.
const data = {
	navMain: [
		{
			title: "New analysis",
			url: "/",
			icon: <Plus />,
			isActive: true,
		},
		{
			title: "History",
			url: "/history",
			icon: <Clock />,
		},
		{
			title: "Models",
			url: "/models",
			icon: <Bot />,
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
				<NavMain items={data.navMain} />
				<NavRecent projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
