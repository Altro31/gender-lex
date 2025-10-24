import NavLink from '@/components/app-sidebar/nav-link'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useLingui } from '@lingui/react/macro'

export function NavMain({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: React.ReactNode
		isActive?: boolean
	}[]
}) {
	const { t } = useLingui()
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{t`Platform`}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map(item => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton tooltip={item.title}>
							<NavLink href={item.url}>
								{item.icon}
								<span>{item.title}</span>
							</NavLink>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
