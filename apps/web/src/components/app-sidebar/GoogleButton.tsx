"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Google from "@/assets/google.webp"
import { authClient } from "@/lib/auth-client"

export default function GoogleButton() {
	return (
		<DropdownMenuItem
			onClick={() => {
				authClient.signIn.social({
					provider: "google",
					callbackURL: "http://localhost:3000",
				})
			}}
		>
			<Image src={Google} alt="google" className="size-4" width={16} />
			Google
		</DropdownMenuItem>
	)
}
