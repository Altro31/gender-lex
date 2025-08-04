import AppSidebar from "@/components/app-sidebar"
import FloatingChatbot from "@/components/floating-chatbot"
import ProviderContainer from "@/components/provider-container"
import ThemeContainer from "@/components/theme/theme-container"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
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
