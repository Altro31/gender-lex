import "server-only"
import createClient from "openapi-fetch"

import envs from "@/lib/env/env-server"
import type { paths } from "@/lib/api/types"
import type { paths as zenPaths } from "@/lib/api/zen-types"
import { cookies } from "next/headers"

export const client = createClient<paths & zenPaths>({
	baseUrl: envs.API_URL,
	async fetch(input) {
		const headers = input.headers
		const cookiesStore = await cookies()
		headers.set("cookie", cookiesStore.toString())
		return fetch(input)
	},
})
