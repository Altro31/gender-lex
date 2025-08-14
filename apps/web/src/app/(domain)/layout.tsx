import AppSidebar from "@/components/app-sidebar/components"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import "@/globals.css"
import type { Metadata } from "next"
import type { PropsWithChildren } from "react"

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
				<SidebarTrigger />
				{children}
			</SidebarInset>
		</>
	)
}
