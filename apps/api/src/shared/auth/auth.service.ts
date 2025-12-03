import { auth } from '@repo/auth/api'
import type { Session, User } from '@repo/db/models'
import { Effect } from 'effect'
import { ContextService } from '../context.service'
import { PrismaService } from '../prisma/prisma.service'

const emptyReturn = { session: undefined, isAuthenticated: false } as {
	session?: Session & { user: User }
	isAuthenticated: boolean
}

export class AuthService extends Effect.Service<AuthService>()('AuthService', {
	effect: Effect.gen(function* () {
		const { headers } = yield* ContextService
		const prisma = yield* PrismaService
		const res = yield* Effect.promise(() =>
			auth.api.getSession({
				headers: new Headers(Object.entries(headers as any)),
			}),
		)
		if (!res) return emptyReturn
		const session = yield* prisma.session.findUniqueOrThrow({
			where: { id: res.session.id },
			include: { user: true },
		})
		return { session, isAuthenticated: Boolean(session) } as {
			session?: Session & { user: User }
			isAuthenticated: boolean
		}
	}),
	dependencies: [PrismaService.Default],
}) {
	static provide = Effect.provide(this.Default)
}
