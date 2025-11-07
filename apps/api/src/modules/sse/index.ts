import auth from "@/lib/auth"
import { sseModels } from "@/modules/sse/model"
import { SseRuntime, SseService } from "@/modules/sse/service"
import { AuthService } from "@/shared/auth.service"
import { ContextService } from "@/shared/context.service"
import { Effect, Stream } from "effect"
import Elysia, { sse } from "elysia"
import { ModelRuntime } from "../model/service"

export default new Elysia({
    name: "sse.controller",
    prefix: "sse",
    tags: ["Sse"],
})
    .use(auth)
    .model(sseModels)
    .get(
        "",
        async function* (ctx) {
            yield sse("Connected!!!")
            const stream = await SseRuntime(ctx).runPromise(
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
                }),
            )
            for await (const a of stream) {
                yield sse(a)
            }
        },
        { response: { "model.status.change": "model.status.change" } },
    )
