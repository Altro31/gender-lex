import { Model } from '@repo/db/schema/model.ts'
import { Schema } from 'effect'
import { t } from 'elysia'

export const modelModels = {
	createModelInput: Model.pipe(
		Schema.pick('apiKey', 'connection', 'name', 'settings'),
	),
	createModelOutput: t.Object({ ok: t.Literal(true) }),
	testConnectionOutput: t.Boolean(),
}
