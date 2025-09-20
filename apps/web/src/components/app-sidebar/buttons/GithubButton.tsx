"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth/auth-client"
import { SiGithub } from "@icons-pack/react-simple-icons"

interface Props {
	redirect: string
}

export default function GithubButton({ redirect }: Props) {
	return (
		<DropdownMenuItem
			onClick={() => {
				authClient.signIn.social({
					provider: "github",
					callbackURL: redirect,
				})
			}}
		>
			<SiGithub />
			Github
		</DropdownMenuItem>
	)
}
