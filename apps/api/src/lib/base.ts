import env from "@/lib/env"
import Elysia from "elysia"

export default new Elysia({ name: "base" }).use(env)
