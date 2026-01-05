import { Bot, Clock, Plus, Settings } from 'lucide-react'
import * as React from 'react'

import { Logo } from '@/components/app-sidebar/logo'
import NavMain from '@/components/app-sidebar/nav-main'
import NavRecent from '@/components/app-sidebar/nav-recent'
import NavUser from '@/components/app-sidebar/nav-user'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { t } from '@lingui/core/macro'
import { Suspense } from 'react'
import { getLocale } from '@/locales/utils/locale'

export default async function AppSidebar(
	props: React.ComponentProps<typeof Sidebar>,
) {
	const locale = await getLocale()
	const data = {
		navMain: [
			{
				title: t`New Analysis`,
				url: `/${locale}`,
				icon: <Plus />,
				isActive: true,
				needAuth: false,
			},
			{
				title: t`History`,
				url: `/${locale}/analysis`,
				icon: <Clock />,
				needAuth: true,
			},
			{
				title: t`Models`,
				url: `/${locale}/models`,
				icon: <Bot />,
				needAuth: true,
			},
			{
				title: t`Presets`,
				url: `/${locale}/presets`,
				icon: <Settings />,
				needAuth: true,
			},
		] satisfies {
			title: string
			url: string
			icon?: React.ReactNode
			isActive?: boolean
			needAuth: boolean
		}[],
	}

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent>
				<Suspense fallback={<Skeleton className="h-32 w-full" />}>
					<NavMain items={data.navMain} />
				</Suspense>
				<Suspense fallback={<Skeleton className="h-24 w-full" />}>
					<NavRecent />
				</Suspense>
			</SidebarContent>
			<SidebarFooter>
				<Suspense fallback={<Skeleton className="h-12 w-full" />}>
					<NavUser />
				</Suspense>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
