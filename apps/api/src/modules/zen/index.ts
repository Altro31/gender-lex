import { ContextService } from '@/shared/context.service'
import { AuthDBService } from '@/shared/db/auth-db.service'
import { ApiHandler } from '@repo/db/client'
import { Effect } from 'effect'
import { Hono } from 'hono'

const zen = new Hono()

// Create a handler that mimics ZenStack's behavior for Hono
const createZenStackHandler = (apiHandler: ApiHandler) => {
	return async (c: any) => {
		const path = c.req.path.replace('/api/crud/', '')
		const method = c.req.method
		
		const client = await Effect.runPromise(
			AuthDBService.pipe(
				AuthDBService.provide,
				ContextService.provide(c),
			),
		)
		
		const body = method !== 'GET' ? await c.req.json() : undefined
		const query = c.req.query()
		
		try {
			const result = await apiHandler.handleRequest({
				method,
				path,
				query,
				requestBody: body,
				prisma: client as any,
			})
			
			return c.json(result.body, result.status)
		} catch (error: any) {
			return c.json({ error: error.message }, 500)
		}
	}
}

const apiHandler = new ApiHandler({ endpoint: 'api/crud' })
const handler = createZenStackHandler(apiHandler)

zen.all('/*', handler)

export default zen
