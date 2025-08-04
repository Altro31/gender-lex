import envs from "@/lib/env/env-server"
import { createAuth } from "@repo/auth"
import { headers } from "next/headers"

export const auth = createAuth(
	(key) => envs[key as keyof typeof envs] as string,
)

export async function getSession() {
	return auth.api.getSession({ headers: await headers() })
}
