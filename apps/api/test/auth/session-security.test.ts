import { describe, it, expect, mock, beforeEach } from "bun:test"
import { Effect } from "effect"
import { UnauthorizedError } from "@/shared/auth/errors/unauthorized.error"

const getSessionMock = mock(() => Promise.resolve(null))

mock.module("@repo/auth/api", () => ({
    auth: {
        api: {
            getSession: getSessionMock,
        },
    },
}))

const { ContextService } = await import("@/shared/context.service")

mock.module("@/shared/auth/auth.service", () => ({
    AuthService: {
        safe: Effect.gen(function* () {
            const ctx = yield* ContextService
            const headers = ctx.req?.raw?.headers || new Headers()
            const result = yield* Effect.promise(() =>
                getSessionMock({ headers }),
            )
            if (!result) {
                return yield* new UnauthorizedError()
            }
            return { session: { ...result.session, user: result.user } }
        }),
        unsafe: Effect.succeed(undefined),
        provide: <A>(effect: Effect.Effect<A>) => effect,
    },
}))

const { AuthService } = await import("@/shared/auth/auth.service")

const runSafe = (headers = new Headers()) =>
    Effect.runPromise(
        AuthService.safe.pipe(
            AuthService.provide,
            ContextService.provide({ req: { raw: { headers } } } as any),
        ),
    )

beforeEach(() => {
    getSessionMock.mockReset()
})

describe("AuthService session security", () => {
    it("rejects expired or missing sessions", async () => {
        getSessionMock.mockResolvedValueOnce(null)

        await expect(runSafe()).rejects.toThrow()
        expect(getSessionMock).toHaveBeenCalledTimes(1)
    })

    it("forwards HttpOnly cookies to the auth provider", async () => {
        const headers = new Headers({
            cookie: "auth_session=secure-token; HttpOnly; Path=/",
        })

        getSessionMock.mockResolvedValueOnce({
            session: {
                id: "session-cookie",
                expiresAt: new Date(Date.now() + 60_000).toISOString(),
            },
            user: {
                id: "user-cookie",
                email: "secure@example.com",
                role: "authenticated",
            },
        })

        const result = await runSafe(headers)
        expect(result.session.user.id).toBe("user-cookie")
        expect(getSessionMock).toHaveBeenCalledWith({ headers })
    })

    it("returns enriched sessions for Google OAuth logins", async () => {
        getSessionMock.mockResolvedValueOnce({
            session: {
                id: "sess-google",
                expiresAt: new Date(Date.now() + 60_000).toISOString(),
            },
            user: {
                id: "google-user",
                email: "google@example.com",
                role: "authenticated",
                provider: "google",
            },
        })

        const result = await runSafe()
        expect(result.session.user.provider).toBe("google")
    })

    it("returns enriched sessions for GitHub OAuth logins", async () => {
        getSessionMock.mockResolvedValueOnce({
            session: {
                id: "sess-github",
                expiresAt: new Date(Date.now() + 60_000).toISOString(),
            },
            user: {
                id: "github-user",
                email: "github@example.com",
                role: "authenticated",
                provider: "github",
            },
        })

        const result = await runSafe()
        expect(result.session.user.provider).toBe("github")
    })
})
