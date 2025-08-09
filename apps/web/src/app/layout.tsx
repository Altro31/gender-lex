import FloatingChatbot from "@/components/floating-chatbot"
import ProviderContainer from "@/components/provider-container"
import ThemeRegister from "@/components/theme/theme-register"
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
					{children}
					<FloatingChatbot />
					<Toaster richColors position="bottom-right" />
					<ThemeRegister />
				</ProviderContainer>
			</body>
		</html>
	)
}
