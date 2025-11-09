import { effectPlugin } from "@/lib/effect"
import { sseModels } from "@/modules/sse/model"
import { SseService } from "@/modules/sse/service"
import { AuthService } from "@/shared/auth.service"
import { Effect, Stream } from "effect"
import Elysia, { sse } from "elysia"

export default new Elysia({
    name: "sse.controller",
    prefix: "sse",
    tags: ["Sse"],
})
    .use(effectPlugin)
    .model(sseModels)
    .get(
        "",
        async function* ({ runtime }) {
            yield sse("Connected!!!")
            const stream = await runtime.runPromise(
                Effect.gen(function* () {
                    const authService = yield* AuthService
                    const sseService = yield* SseService
                    const stream = sseService.stream$.pipe(
                        Stream.filter(
                            message =>
                                message?.sessionId ===
                                    authService.session?.id ||
                                message?.userId === authService.user?.id ||
                                message?.event === "ping",
                        ),
                    )
                    return Stream.toAsyncIterable(stream)
                }).pipe(SseService.provide, AuthService.provide),
            )
            for await (const a of stream) {
                yield sse(a)
            }
        },
        { response: { "model.status.change": "model.status.change" } },
    )
