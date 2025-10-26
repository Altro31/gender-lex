import AppSidebar from "@/components/app-sidebar"
import MobileSidebarTrigger from "@/components/app-sidebar/mobile-sidebar-trigger"
import { SidebarInset } from "@/components/ui/sidebar"
import "@/globals.css"
import { setServerLocale } from "@/locales/request"
import { t } from "@lingui/core/macro"
import type { Metadata } from "next"

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
	await setServerLocale(params)

	return {
		title: t`GenderLex | Your smart writing assistant`,
		description: t`GenderLex, your smart writing assistant`,
	} as Metadata
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
