import { AuthService } from "@/shared/auth/auth.service"
import type { MessageMapper } from "@repo/types/sse"
import { Effect, PubSub, Schedule, Stream } from "effect"

type MessageEvent<Type extends keyof MessageMapper> = {
    event: Type | "ping"
    data?: MessageMapper[Type] & { sessionId: string; userId: string }
    sessionId?: string
    userId?: string
}

const pubsub = Effect.runSync(PubSub.unbounded<MessageEvent<any>>())

export class SseService extends Effect.Service<SseService>()("SseService", {
    effect: Effect.gen(function* () {
        const { session } = yield* AuthService.safe

        yield* PubSub.publish(pubsub, { event: "ping" }).pipe(
            Effect.repeat(Schedule.fixed("15 seconds")),
            Effect.forkDaemon,
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
                    userId: session!.user!.id,
                })
            },
        }

        return services
    }),
    dependencies: [AuthService.Default],
}) {
    static provide = Effect.provide(this.Default)
}
