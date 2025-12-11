import { ContextService } from '@/shared/context.service'
import { createElysiaHandler } from '@zenstackhq/server/elysia'
import { ApiHandler } from '@repo/db/client'
import { Effect } from 'effect'
import Elysia from 'elysia'
import { AuthDBService } from '@/shared/db/auth-db.service'

export default new Elysia({
	prefix: 'api/crud',
	name: 'zen.controller',
	tags: ['Zenstack'],
	detail: { hide: true },
}).use(
	createElysiaHandler({
		apiHandler: new ApiHandler(),
		getClient: ctx =>
			Effect.runPromise(
				AuthDBService.pipe(
					AuthDBService.provide,
					ContextService.provide(ctx),
				),
			),
		basePath: '/api/crud',
	}),
)
