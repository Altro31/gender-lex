"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppProgressProvider as ProgressProvider } from "@bprogress/next"
import type { PropsWithChildren } from "react"

export default function ProviderContainer({
	children,
}: Readonly<PropsWithChildren>) {
	return (
		<ProgressProvider
			color="blue"
			height="3px"
			options={{ showSpinner: false }}
		>
			<SidebarProvider>{children}</SidebarProvider>
		</ProgressProvider>
	)
}
