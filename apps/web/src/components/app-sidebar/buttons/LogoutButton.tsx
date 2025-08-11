"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth/auth-client"
import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

interface Props {
	redirect?: string
}

export default function LogoutButton({ redirect }: Props) {
	const t = useTranslations()
	const router = useRouter()
	return (
		<DropdownMenuItem
			onClick={async () => {
				await authClient.signOut()
				router.refresh()
			}}
		>
			<LogOut />
			{t('Actions.log-out')}
		</DropdownMenuItem>
	)
}
