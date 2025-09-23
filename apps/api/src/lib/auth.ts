import Elysia from "elysia"
import { auth } from "@repo/auth/nest"
import type { Session, User } from "@repo/db/models"

export default new Elysia({ name: "auth" })
    .mount(auth.handler)
    .derive({ as: "global" }, async ({ status, request: { headers } }) => {
        const session = await auth.api.getSession({ headers })
        return {
            user: session?.user as User | undefined,
            session: session?.session as Session | undefined,
        }
    })
