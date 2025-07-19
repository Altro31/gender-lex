"use client"

import type { PropsWithChildren } from "react"
import { AppProgressProvider as ProgressProvider } from "@bprogress/next"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function ProviderContainer({
	children,
}: Readonly<PropsWithChildren>) {
	return (
		<SessionProvider>
			<ProgressProvider
				color="blue"
				height="3px"
				options={{ showSpinner: false }}
			>
				<SidebarProvider>{children}</SidebarProvider>
			</ProgressProvider>
		</SessionProvider>
	)
}
