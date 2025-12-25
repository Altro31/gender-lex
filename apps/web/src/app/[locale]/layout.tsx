import FloatingChatbot from '@/components/floating-chatbot'
import ProgressProvider from '@/components/progress-provider'
import { LinguiProvider } from '@/components/providers/lingui-provider'
import QueryProvider from '@/components/providers/query-provider'
import { PushNotificationManager } from '@/components/pwa/push-notification-manager'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import '@/globals.css'
import { EventSourceProvider } from '@/lib/sse'
import { setServerLocale } from '@/locales/request'
import { NuqsAdapter } from 'nuqs/adapters/next'
import { Suspense } from 'react'
import config from '@/../lingui.config'
import ThemeProvider from '@/components/providers/theme-provider'

export function generateStaticParams() {
	return config.locales.map(locale => ({ locale }))
}

export default async function RootLayout({
	children,
}: LayoutProps<'/[locale]'>) {
	const i18n = await setServerLocale()
	return (
		<html lang={i18n.locale} suppressHydrationWarning>
			<body className="relative">
				<PushNotificationManager />
				<ThemeProvider>
					{/*<ThemeRegister />*/}
					<LinguiProvider
						initialLocale={i18n.locale}
						initialMessages={i18n.messages}
					>
						<ProgressProvider>
							<NuqsAdapter>
								<QueryProvider>
									<EventSourceProvider>
										<SidebarProvider>
											{children}
											<Suspense>
												<FloatingChatbot />
											</Suspense>
											<Toaster
												richColors
												position="bottom-right"
											/>
										</SidebarProvider>
									</EventSourceProvider>
								</QueryProvider>
							</NuqsAdapter>
						</ProgressProvider>
					</LinguiProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
