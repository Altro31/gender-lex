import analysis from '@/modules/analysis'
import model from '@/modules/model'
import sse from '@/modules/sse'
import zen from '@/modules/zen'
import { cors } from '@elysiajs/cors'
import openapi, { fromTypes } from '@elysiajs/openapi'
import { auth } from '@repo/auth/api'
import { Elysia } from 'elysia'
import z from 'zod'

export type App = typeof app
const app = new Elysia()
	.use(cors())
	.mount(auth.handler)
	.use(
		openapi({
			references: fromTypes(),
			mapJsonSchema: {
				zod: (arg: any) =>
					z.toJSONSchema(arg, { unrepresentable: 'any' }),
			},
		}),
	)
	.use(sse)
	.use(model)
	.use(analysis)
	.use(zen)
	.get('/', () => {
		return { ok: true }
	})

// console.log(`	🚀Server running at ${app.server?.url}`)
// console.log(`	📖Docs running at ${app.server?.url}openapi`)

export default app.compile()
