import { describe, it, beforeEach, expect, mock } from "bun:test"
import { Cause, Effect, Exit } from "effect"
import { Hono } from "hono"
import { UnauthorizedError } from "@/shared/auth/errors/unauthorized.error"

type MockSession = {
    id: string
    user: {
        id: string
        email: string
        role: string
    }
    expiresAt: string
    provider?: string
}

let currentSession: MockSession | undefined

mock.module("@/plugins/effect.plugin", () => ({
    runEffectWithContext:
        () =>
        <A>(effect: Effect.Effect<A>) =>
            Effect.runPromiseExit(effect).then(exit => {
                if (Exit.isSuccess(exit)) return exit.value
                if (Cause.isFailType(exit.cause)) {
                    throw exit.cause.error
                }
                throw exit.cause
            }),
}))

mock.module("@/shared/auth/auth.service", () => ({
    AuthService: {
        safe: Effect.gen(function* () {
            if (!currentSession) {
                return yield* new UnauthorizedError()
            }
            return { session: currentSession }
        }),
        unsafe: Effect.succeed(currentSession),
        provide: <A>(effect: Effect.Effect<A>) => effect,
    },
}))

const { requireAuth } = await import("@/plugins/auth.plugin")

const buildApp = () => {
    const app = new Hono()
    app.use("*", requireAuth)
    app.get("/secure", c => c.json({ status: "ok", session: currentSession }))
    app.onError((err, c) =>
        c.json(
            { message: (<any>err).statusText ?? err.message },
            (<any>err).status ?? 500,
        ),
    )
    return app
}

const setAuthState = (session?: MockSession) => {
    currentSession = session
}

beforeEach(() => {
    currentSession = undefined
})

describe("requireAuth middleware", () => {
    it("blocks unauthenticated access to protected routes", async () => {
        const app = buildApp()
        const response = await app.request("/secure")
        expect(response.status).toBe(401)
        const payload = (await response.json()) as { message: string }
        expect(payload.message).toBe("Unauthorized")
    })

    it("allows Google OAuth sessions to reach protected routes", async () => {
        setAuthState({
            id: "sess-google",
            user: {
                id: "user-google",
                email: "google@example.com",
                role: "authenticated",
            },
            expiresAt: new Date(Date.now() + 60_000).toISOString(),
            provider: "google",
        })

        const app = buildApp()
        const response = await app.request("/secure")
        expect(response.status).toBe(200)
        const payload = (await response.json()) as { session: MockSession }
        expect(payload.session?.provider).toBe("google")
        expect(payload.session?.user.email).toBe("google@example.com")
    })

    it("allows GitHub OAuth sessions to reach protected routes", async () => {
        setAuthState({
            id: "sess-github",
            user: {
                id: "user-github",
                email: "gh@example.com",
                role: "authenticated",
            },
            expiresAt: new Date(Date.now() + 60_000).toISOString(),
            provider: "github",
        })

        const app = buildApp()
        const response = await app.request("/secure")
        expect(response.status).toBe(200)
        const payload = (await response.json()) as { session: MockSession }
        expect(payload.session?.provider).toBe("github")
        expect(payload.session?.user.email).toBe("gh@example.com")
    })
})
