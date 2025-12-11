import { ZenStackClient } from '@zenstackhq/orm'
import { PostgresDialect } from '@zenstackhq/orm/dialects/postgres'
import { Pool } from 'pg'
import { PolicyPlugin } from '@zenstackhq/plugin-policy'
import { schema } from './generated/schema.ts'
import { RestApiHandler } from '@zenstackhq/server/api'

export type ClientType = typeof client
export const client = new ZenStackClient(schema, {
	dialect: new PostgresDialect({
		pool: new Pool({ connectionString: process.env.DATABASE_URL }),
	}),
})

export const authClient = client.$use(new PolicyPlugin())

export class ApiHandler extends RestApiHandler {
	constructor() {
		super({ schema })
	}
}
