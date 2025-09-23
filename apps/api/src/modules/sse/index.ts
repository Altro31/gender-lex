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
        async function* ({ sseService }) {
            yield sse("Connected!!!")

            while (true) {
                const { promise, resolve } = Promise.withResolvers<any>()
                const timer = setTimeout(
                    () => resolve({ event: "ping" }),
                    15000,
                )
                sseService.subscribe(e => {
                    resolve(e)
                    clearTimeout(timer)
                })
                const data = await promise
                yield sse(data)
                sseService.unsubscribe(resolve)
            }
        },
        { response: { "model.status.change": "model.status.change" } },
    )
