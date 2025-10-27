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
import { t } from "@lingui/core/macro"
import { Suspense } from "react"

export default async function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const data = {
		navMain: [
			{
				title: t`New Analysis`,
				url: "/",
				icon: <Plus />,
				isActive: true,
			},
			{ title: t`History`, url: "/analysis", icon: <Clock /> },
			{ title: t`Models`, url: "/models", icon: <Bot /> },
			{ title: t`Presets`, url: "/presets", icon: <Settings /> },
		] satisfies {
			title: string
			url: string
			icon?: React.ReactNode
			isActive?: boolean
		}[],
	}

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
