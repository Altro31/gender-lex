"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export default function MobileSidebarTrigger() {
	const { isMobile } = useSidebar()
	return isMobile && <SidebarTrigger />
}
