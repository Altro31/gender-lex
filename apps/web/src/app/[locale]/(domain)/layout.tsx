import "@/globals.css"
import AppSidebar from "@/components/app-sidebar"
import MobileSidebarTrigger from "@/components/app-sidebar/mobile-sidebar-trigger"
import { SidebarInset } from "@/components/ui/sidebar"
import { setServerLocale } from "@/locales/request"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "GenderLex",
	description: "GenderLex",
}

export default async function RootLayout({
	children,
	params,
}: LayoutProps<"/[locale]">) {
	await setServerLocale(params)
	return (
		<>
			<AppSidebar />
			<SidebarInset>
				<MobileSidebarTrigger />
				{children}
			</SidebarInset>
		</>
	)
}
