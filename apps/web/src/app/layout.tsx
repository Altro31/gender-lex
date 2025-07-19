import AppSidebar from "@/components/app-sidebar"
import ProviderContainer from "@/components/provider-container"
import ThemeContainer from "@/components/theme/theme-container"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import "@/globals.css"
import type { Metadata } from "next"
import type { PropsWithChildren } from "react"

export const metadata: Metadata = {
	title: "GenderLex",
	description: "GenderLex",
}

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<html lang="en">
			<body className="relative">
				<ProviderContainer>
					<AppSidebar />
					<SidebarInset>
						<SidebarTrigger />
						<ThemeContainer />
						{children}
					</SidebarInset>
				</ProviderContainer>
			</body>
		</html>
	)
}
