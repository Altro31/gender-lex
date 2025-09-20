"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth/auth-client"
import { SiGoogle } from "@icons-pack/react-simple-icons"

interface Props {
	redirect: string
}

export default function GoogleButton({ redirect }: Props) {
	return (
		<DropdownMenuItem
			onClick={() => {
				authClient.signIn.social({
					provider: "google",
					callbackURL: redirect,
				})
			}}
		>
			<SiGoogle />
			Google
		</DropdownMenuItem>
	)
}
