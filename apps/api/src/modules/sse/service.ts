import auth from "@/lib/auth"
import { MessageMapper } from "@repo/types/sse"
import Elysia from "elysia"
import { EventEmitter } from "events"

type MessageEvent<Type extends keyof MessageMapper> = {
    type: Type
    data: MessageMapper[Type] & { sessionId: string; userId: string }
    sessionId: string
    userId: string
}

const eventBus = new EventEmitter()

export const sseService = new Elysia({ name: "sse.service" })
    .use(auth)
    .derive({ as: "global" }, ({ session, user }) => ({
        sseService: {
            subscribe<Type extends keyof MessageMapper>(
                func: (event: MessageEvent<Type>) => void,
            ) {
                eventBus.on("sse", func)
            },

            unsubscribe(func: () => void) {
                eventBus.off("sse", func)
            },

            broadcast<Type extends keyof MessageMapper>(
                event: Type,
                data: MessageMapper[Type],
            ) {
                eventBus.emit("sse", {
                    event,
                    data,
                    sessionId: session!.id,
                    userId: user!.id,
                })
            },
        },
    }))
