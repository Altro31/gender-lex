import FloatingChatbot from "@/components/floating-chatbot"
import ProviderContainer from "@/components/provider-container"
import ThemeContainer from "@/components/theme/theme-container"
import { Toaster } from "@/components/ui/sonner"
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
		<html lang="en">
			<body className="relative">
				<ProviderContainer>
					<ThemeContainer />
					{children}
					<FloatingChatbot />
					<Toaster richColors position="bottom-right" />
				</ProviderContainer>
			</body>
		</html>
	)
}
