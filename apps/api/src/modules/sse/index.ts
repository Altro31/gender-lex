import type { HonoVariables } from "@/lib/types/hono-variables"
import { SseService } from "@/modules/sse/service"
import { AuthService } from "@/shared/auth/auth.service"
import { ContextService } from "@/shared/context.service"
import { Effect, Stream } from "effect"
import { Hono } from "hono"
import { streamSSE } from "hono/streaming"

const sse = new Hono<HonoVariables>().get("/", async c => {
    const runEffect = c.get("runEffect")
    const shouldCloseAfterHandshake = c.req.query("close") === "1"

    return streamSSE(c, async stream => {
        // Send initial connection message
        await stream.writeSSE({ data: "Connected!!!" })

        if (shouldCloseAfterHandshake) {
            return
        }

        const asyncIterable = await runEffect(
            Effect.gen(function* () {
                const session = yield* AuthService.unsafe
                const sseService = yield* SseService
                const effectStream = sseService.stream$.pipe(
                    Stream.filter(
                        message =>
                            message?.sessionId === session?.id ||
                            message?.userId === session?.user.id ||
                            message?.event === "ping",
                    ),
                )
                return Stream.toAsyncIterable(effectStream)
            }).pipe(
                SseService.provide,
                AuthService.provide,
                ContextService.provide(c),
            ),
        )

        for await (const message of asyncIterable) {
            await stream.writeSSE({ data: JSON.stringify(message) })
        }
    })
})

export default sse
export type SseAppType = typeof sse
