import "server-only"
import createClient from "openapi-fetch"

import envs from "@/env"
import type { paths } from "@/lib/api/types"

export const client = createClient<paths>({
	baseUrl: envs.API_URL + "/api/zen/",
})
