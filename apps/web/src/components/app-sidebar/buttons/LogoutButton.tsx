"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth/auth-client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
	redirect?: string
}

export default function LogoutButton({ redirect }: Props) {
	const router = useRouter()
	return (
		<DropdownMenuItem
			onClick={async () => {
				await authClient.signOut()
				router.refresh()
			}}
		>
			<LogOut />
			Log out
		</DropdownMenuItem>
	)
}
