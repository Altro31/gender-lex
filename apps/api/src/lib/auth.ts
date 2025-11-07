import Elysia from "elysia"
import { auth } from "@repo/auth/nest"
import type { Session, User } from "@repo/db/models"

export default new Elysia({ name: "auth" }).mount(auth.handler)
