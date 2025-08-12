import type { auth } from "@/lib/auth/auth-server"
import {
	anonymousClient,
	customSessionClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
	basePath: "/api/auth",
	plugins: [customSessionClient<typeof auth>(), anonymousClient()],
})
