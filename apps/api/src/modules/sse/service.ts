import { AuthService } from "@/shared/auth.service"
import { ContextService } from "@/shared/context.service"
import type { MessageMapper } from "@repo/types/sse"
import { Effect, Layer, ManagedRuntime, PubSub, Schedule, Stream } from "effect"

type MessageEvent<Type extends keyof MessageMapper> = {
    event: Type | "ping"
    data?: MessageMapper[Type] & { sessionId: string; userId: string }
    sessionId?: string
    userId?: string
}

export class SseService extends Effect.Service<SseService>()("SseService", {
    effect: Effect.gen(function* () {
        const { session, user } = yield* AuthService
        const pubsub = SseService.pubsub
        Effect.runFork(
            PubSub.publish(pubsub, { event: "ping" }).pipe(
                Effect.repeat(Schedule.fixed("15 seconds")),
            ),
        )
        const services = {
            get stream$() {
                return Stream.fromPubSub(pubsub)
            },

            broadcast<Type extends keyof MessageMapper>(
                event: Type,
                data: MessageMapper[Type],
            ) {
                return PubSub.publish(pubsub, {
                    event,
                    data,
                    sessionId: session!.id,
                    userId: user!.id,
                })
            },
        }

        return services
    }),
    dependencies: [AuthService.Default],
}) {
    static pubsub = Effect.runSync(PubSub.unbounded<MessageEvent<any>>())
    static provide = Effect.provide(SseService.Default)
}

export function SseRuntime(ctx: any) {
    return ManagedRuntime.make(
        Layer.mergeAll(SseService.Default, AuthService.Default).pipe(
            Layer.provide(ContextService.Default(ctx)),
        ),
    )
}
