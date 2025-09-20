import AppSidebar from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import "@/globals.css"
import type { Metadata } from "next"
import type { PropsWithChildren } from "react"
import MobileSidebarTrigger from "@/components/app-sidebar/mobile-sidebar-trigger"

export const metadata: Metadata = {
	title: "GenderLex",
	description: "GenderLex",
}

export default async function RootLayout({
	children,
}: Readonly<PropsWithChildren>) {
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
