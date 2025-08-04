import { auth } from "@/lib/auth/auth-server"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
	basePath: "/api/auth",
})
