import envs from "@/lib/env/env-server"
import { type NextRequest } from "next/server"

export function GET(req: NextRequest) {
	return fetch(envs.API_URL + "/sse", {
		headers: req.headers,
	})
}
