import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth/auth-client"
import { LogOut } from "lucide-react"
import { revalidatePath } from "next/cache"
import type { PropsWithChildren } from "react"

export default function LogoutButton({ children }: PropsWithChildren) {
	const logOut = async () => {
		"use server"

		await authClient.signOut()
		revalidatePath("")
	}

	return (
		<DropdownMenuItem onClick={logOut}>
			<LogOut />
			{children}
		</DropdownMenuItem>
	)
}
