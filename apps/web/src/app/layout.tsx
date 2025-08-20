import FloatingChatbot from "@/components/floating-chatbot"
import ProgressProvider from "@/components/progress-provider"
import ThemeRegister from "@/components/theme/theme-register"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import "@/globals.css"
import { EventSourceProvider } from "@/lib/sse"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { NuqsAdapter } from "nuqs/adapters/next"

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
				<ProgressProvider>
					<NuqsAdapter>
						<NextIntlClientProvider>
							<EventSourceProvider>
								<SidebarProvider>
									{children}
									<FloatingChatbot />
									<Toaster
										richColors
										position="bottom-right"
									/>
									<ThemeRegister />
								</SidebarProvider>
							</EventSourceProvider>
						</NextIntlClientProvider>
					</NuqsAdapter>
				</ProgressProvider>
			</body>
		</html>
	)
}
