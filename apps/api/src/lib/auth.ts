import { auth } from "@repo/auth/nest"
import Elysia from "elysia"

export default new Elysia({ name: "auth" }).mount(auth.handler)
