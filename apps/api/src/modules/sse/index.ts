import auth from "@/lib/auth"
import { sseModels } from "@/modules/sse/model"
import { sseService } from "@/modules/sse/service"
import Elysia, { sse, t } from "elysia"

export default new Elysia({
    name: "sse.controller",
    prefix: "sse",
    tags: ["Sse"],
})
    .use(auth)
    .use(sseService)
    .model(sseModels)
    .get(
        "",
        async function* ({ sseService, user, session }) {
            yield sse("Connected!!!")

            while (true) {
                const { promise, resolve } = Promise.withResolvers<any>()
                const timer = setTimeout(
                    () => resolve({ event: "ping" }),
                    15000,
                )
                const func = (e: any) => {
                    resolve(e)
                    clearTimeout(timer)
                }
                sseService.subscribe(func)
                const data = await promise
                if (
                    data.sessionId === session?.id ||
                    data.userId === user?.id
                ) {
                    yield sse(data)
                }
                sseService.unsubscribe(func)
            }
        },
        { response: { "model.status.change": "model.status.change" } },
    )
