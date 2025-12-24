import { z } from 'zod'

const Envs = z
	.object({
		PORT: z.coerce.number().int().positive(),
		API_URL: z.url(),
		AUTH_GOOGLE_ID: z.string(),
		AUTH_GOOGLE_SECRET: z.string(),
		AUTH_GITHUB_ID: z.string(),
		AUTH_GITHUB_SECRET: z.string(),
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.url(),
		UI_URL: z.url(),
		ENCRYPTION_KEY: z.string().length(32),
		GEMINI_API_KEY: z.string(),
		WORKFLOW_TARGET_WORLD: z.enum(['@workflow/world-postgres']).optional(),
		WORKFLOW_POSTGRES_URL: z.string().optional(),
		DATABASE_URL: z.string(),
		WORKFLOW_POSTGRES_JOB_PREFIX: z.string().optional(),
		WORKFLOW_POSTGRES_WORKER_CONCURRENCY: z.coerce
			.number()
			.int()
			.optional(),
		NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string(),
		VAPID_PRIVATE_KEY: z.string(),
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

const envs = z.parse(Envs, process.env)
export default envs
