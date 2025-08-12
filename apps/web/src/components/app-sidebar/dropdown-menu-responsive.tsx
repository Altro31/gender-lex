"use client"

import { DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"
import type { PropsWithChildren } from "react"

export default function DropdownMenuResponsive({
	children,
}: PropsWithChildren) {
	const { isMobile } = useSidebar()

	return (
		<DropdownMenuContent
			className="w-48 rounded-lg"
			side={isMobile ? "bottom" : "right"}
			align={isMobile ? "end" : "start"}
		>
			{children}
		</DropdownMenuContent>
	)
}
