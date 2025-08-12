import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import Link from "next/link"

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
						<SidebarMenuButton tooltip={t(item.title)} asChild>
							<Link href={item.url}>
								{item.icon}
								<span>{t(item.title)}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
