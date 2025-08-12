import FloatingChatbot from "@/components/floating-chatbot"
import ProviderContainer from "@/components/provider-container"
import ThemeRegister from "@/components/theme/theme-register"
import { Toaster } from "@/components/ui/sonner"
import "@/globals.css"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"

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
					<NextIntlClientProvider>
						{children}
						<FloatingChatbot />
						<Toaster richColors position="bottom-right" />
						<ThemeRegister />
					</NextIntlClientProvider>
				</ProviderContainer>
			</body>
		</html>
	)
}
