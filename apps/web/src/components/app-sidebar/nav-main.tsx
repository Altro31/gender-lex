import NavLink from "@/components/app-sidebar/nav-link"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"

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
	const t = useTranslations()
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{t("sidebar.platform")}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton tooltip={t(item.title)}>
							<NavLink href={item.url}>
								{item.icon}
								<span>{t(item.title)}</span>
							</NavLink>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
