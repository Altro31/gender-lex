"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { EventSourceProvider } from "@/lib/sse"
import { AppProgressProvider as ProgressProvider } from "@bprogress/next"
import { NuqsAdapter } from "nuqs/adapters/next"
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
			<NuqsAdapter>
				<EventSourceProvider>
					<SidebarProvider>{children}</SidebarProvider>
				</EventSourceProvider>
			</NuqsAdapter>
		</ProgressProvider>
	)
}
