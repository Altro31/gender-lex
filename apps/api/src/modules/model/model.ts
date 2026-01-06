import z from 'zod'

export const modelModels = {
	// createModelInput: Model.pipe(
	// 	Schema.pick('apiKey', 'connection', 'name', 'settings'),
	// ),
	createModelOutput: z.object({ ok: z.literal(true) }),
	testConnectionOutput: z.boolean(),
}
