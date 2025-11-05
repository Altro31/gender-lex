import AppSidebar from '@/components/app-sidebar'
import MobileSidebarTrigger from '@/components/app-sidebar/mobile-sidebar-trigger'
import { SidebarInset } from '@/components/ui/sidebar'
import '@/globals.css'
import { setServerLocale } from '@/locales/request'

export default async function RootLayout({
	children,
}: LayoutProps<'/[locale]'>) {
	await setServerLocale()
	return (
		<>
			<AppSidebar />
			<SidebarInset>
				<MobileSidebarTrigger />
				{children}
			</SidebarInset>
		</>
	)
}
