import FloatingChatbot from "@/components/floating-chatbot"
import ProviderContainer from "@/components/provider-container"
import ThemeRegister from "@/components/theme/theme-register"
import { Toaster } from "@/components/ui/sonner"
import "@/globals.css"
import LocaleProvider from "@/locales/components/locale-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "GenderLex",
	description: "GenderLex",
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className="relative">
				<ProviderContainer>
					<LocaleProvider>
						{children}
						<FloatingChatbot />
						<Toaster richColors position="bottom-right" />
						<ThemeRegister />
					</LocaleProvider>
				</ProviderContainer>
			</body>
		</html>
	)
}
