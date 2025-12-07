import { ContextService } from '@/shared/context.service'
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
		getPrisma: ctx =>
			Effect.runPromise(
				EnhancedPrismaService.pipe(
					EnhancedPrismaService.provide,
					ContextService.provide(ctx),
				),
			),
		basePath: '/api/crud',
	}),
)
