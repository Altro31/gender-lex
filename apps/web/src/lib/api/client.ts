import envs from "@/lib/env/env-server"
import { treaty } from "@elysiajs/eden"
import { App } from "api"
import "server-only"

export const client = treaty<App>(envs.API_URL)
