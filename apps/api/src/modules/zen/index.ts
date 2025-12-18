import { ContextService } from '@/shared/context.service'
import { AuthDBService } from '@/shared/db/auth-db.service'
import { ApiHandler } from '@repo/db/client'
import { createElysiaHandler } from '@zenstackhq/server/elysia'
import { Effect } from 'effect'
import Elysia from 'elysia'

export default new Elysia({
	prefix: 'api/crud',
	name: 'zen.controller',
	tags: ['Zenstack'],
	detail: { hide: true },
}).use(
	createElysiaHandler({
		apiHandler: new ApiHandler({ endpoint: 'api/crud' }),
		getClient: ctx =>
			Effect.runPromise(
				AuthDBService.pipe(
					AuthDBService.provide,
					ContextService.provide(ctx),
				),
			) as any,
		basePath: '/api/crud',
	}),
)
