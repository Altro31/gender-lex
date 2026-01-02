import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getSession } from '@/lib/auth/auth-server'
import { t } from '@lingui/core/macro'
import Link from 'next/link'

export default async function NavMain({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: React.ReactNode
		isActive?: boolean
		needAuth: boolean
	}[]
}) {
	const session = await getSession()
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{t`Platform`}</SidebarGroupLabel>
			<SidebarMenu>
				{items
					.filter(i => !i.needAuth || session)
					.map(item => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								render={<Link href={item.url} />}
							>
								{item.icon}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
