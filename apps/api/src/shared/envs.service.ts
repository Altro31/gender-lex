import { Effect } from 'effect'
import { env } from 'elysia'
import z from 'zod'

export class EnvsService extends Effect.Service<EnvsService>()('EnvsService', {
	effect: Effect.gen(function* () {
		return parseEnvs(env)
	}),
}) {
	static provide = Effect.provide(this.Default)
}

function parseEnvs(envs: any) {
	return z
		.object({
			PORT: z.coerce.number().int().min(0).default(4000),
			GROQ_API_KEY: z.string(),
			GEMINI_API_KEY: z.string(),
			PDF_SERVICES_CLIENT_ID: z.string(),
			PDF_SERVICES_CLIENT_SECRET: z.string(),
			BETTER_AUTH_SECRET: z.string().min(32),
			BETTER_AUTH_URL: z.url(),
			UI_URL: z.url(),
			AUTH_GOOGLE_ID: z.string(),
			AUTH_GOOGLE_SECRET: z.string(),
			AUTH_GITHUB_ID: z.string(),
			AUTH_GITHUB_SECRET: z.string(),
			ENCRYPTION_KEY: z.string().length(32),
			UMLS_API_KEY: z.string(),
			UMLS_API_URL: z.url(),
			WORKFLOW_TARGET_WORLD: z
				.enum(['@workflow/world-postgres'])
				.optional(),
			WORKFLOW_POSTGRES_URL: z.string().optional(),
			DATABASE_URL: z.string(),
			WORKFLOW_POSTGRES_JOB_PREFIX: z.string().optional(),
			WORKFLOW_POSTGRES_WORKER_CONCURRENCY: z.coerce
				.number()
				.int()
				.optional(),
		})
		.superRefine(
			(
				{
					WORKFLOW_TARGET_WORLD,
					WORKFLOW_POSTGRES_URL,
					WORKFLOW_POSTGRES_JOB_PREFIX,
					WORKFLOW_POSTGRES_WORKER_CONCURRENCY,
				},
				ctx,
			) => {
				if (
					WORKFLOW_TARGET_WORLD === '@workflow/world-postgres' &&
					!(
						WORKFLOW_POSTGRES_URL &&
						WORKFLOW_POSTGRES_JOB_PREFIX &&
						WORKFLOW_POSTGRES_WORKER_CONCURRENCY
					)
				) {
					ctx.addIssue({
						code: 'custom',
						continue: true,
						path: ['WORKFLOW_TARGET_WORLD'],

						message: `When WORKFLOW_TARGET_WORLD is specidied, then WORKFLOW_POSTGRES_URL, WORKFLOW_POSTGRES_JOB_PREFIX and WORKFLOW_POSTGRES_WORKER_CONCURRENCY must be configured`,
					})
				}
			},
		)
		.parse(envs)
}
