import auth from "@/lib/auth"
import { userService } from "@/modules/user/service"
import Elysia from "elysia"

export default new Elysia({ name: "user", tags: ["User"] })
    .use(auth)
    .use(userService)
