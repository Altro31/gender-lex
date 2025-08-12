"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth/auth-client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import type { PropsWithChildren } from "react"

export default function LogoutButton({ children }: PropsWithChildren) {
	const router = useRouter()
	return (
		<DropdownMenuItem
			onClick={async () => {
				await authClient.signOut()
				router.refresh()
			}}
		>
			<LogOut />
			{children}
		</DropdownMenuItem>
	)
}
