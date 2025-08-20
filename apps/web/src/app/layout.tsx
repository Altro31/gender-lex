import FloatingChatbot from "@/components/floating-chatbot"
import ThemeRegister from "@/components/theme/theme-register"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import "@/globals.css"
import envs from "@/lib/env/env-server"
import { EventSourceProvider } from "@/lib/sse"
import { ProgressProvider } from "@bprogress/next/app"
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
				<ProgressProvider
					color="blue"
					height="3px"
					options={{ showSpinner: false }}
				>
					<NuqsAdapter>
						<NextIntlClientProvider>
							<EventSourceProvider url={envs.API_URL + "/sse"}>
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
