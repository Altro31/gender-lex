import envs from "@/env"
import { createAuth } from "@repo/auth"
import { headers } from "next/headers"

export const auth = createAuth((key: string) => envs[key as keyof typeof envs])

export async function getSession() {
	return auth.api.getSession({ headers: await headers() })
}
