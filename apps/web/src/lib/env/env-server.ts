import { z } from "zod";

const Envs = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  API_URL: z.url().default("http://localhost:4000"),
  NEXT_PUBLIC_API_URL: z
    .url()
    .default("https://gender-lex-back.mayabeque.mdialityc.com"),
  AUTH_GOOGLE_ID: z.string().default(""),
  NEXT_PUBLIC_AUTH_GOOGLE_ID: z
    .string()
    .default(
      "241848770025-7ic9ir9j0adjr8hmpb3lbhdob2kurout.apps.googleusercontent.com"
    ),
  AUTH_GOOGLE_SECRET: z.string().default(""),
  AUTH_GITHUB_ID: z.string().default(""),
  AUTH_GITHUB_SECRET: z.string().default(""),
  BETTER_AUTH_SECRET: z.string().default(""),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
  UI_URL: z.url().default("https://gender-lex-front.mayabeque.mdialityc.com"),
  NEXT_PUBLIC_UI_URL: z
    .url()
    .default("https://gender-lex-front.mayabeque.mdialityc.com"),
  ENCRYPTION_KEY: z
    .string()
    .length(32)
    .default("00000000000000000000000000000000"),
  GEMINI_API_KEY: z.string().default(""),
  // WORKFLOW_TARGET_WORLD: z.enum(['@workflow/world-postgres']).optional(),
  // WORKFLOW_POSTGRES_URL: z.string().optional(),
  DATABASE_URL: z.string().default("postgresql://localhost:5432/genderlex"),
  // WORKFLOW_POSTGRES_JOB_PREFIX: z.string().optional(),
  // WORKFLOW_POSTGRES_WORKER_CONCURRENCY: z.coerce
  // .number()
  // .int()
  // .optional(),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z
    .string()
    .default(
      "BNYDzPXppmQdVfmPJZ-zmKzEoBaj-HXj7I1G3hP_wvCICVNsTarhuGkA5no1w5wLuGxXiQ1XruKSyBRw0lteZWw"
    ),
  VAPID_PRIVATE_KEY: z.string().default(""),
  CHATBOT_PROVIDER_URL: z.url().default("http://localhost:4000"),
  CHATBOT_PROVIDER_API_KEY: z.string().optional(),
  CHATBOT_MODEL_IDENTIFIER: z.string().default("gemini-1.5-flash"),
});
// .superRefine(
// 	(
// 		{
// 			WORKFLOW_TARGET_WORLD,
// 			WORKFLOW_POSTGRES_URL,
// 			WORKFLOW_POSTGRES_JOB_PREFIX,
// 			WORKFLOW_POSTGRES_WORKER_CONCURRENCY,
// 		},
// 		ctx,
// 	) => {
// 		if (
// 			WORKFLOW_TARGET_WORLD === '@workflow/world-postgres' &&
// 			!(
// 				WORKFLOW_POSTGRES_URL &&
// 				WORKFLOW_POSTGRES_JOB_PREFIX &&
// 				WORKFLOW_POSTGRES_WORKER_CONCURRENCY
// 			)
// 		) {
// 			ctx.addIssue({
// 				code: 'custom',
// 				continue: true,
// 				path: ['WORKFLOW_TARGET_WORLD'],

// 				message: `When WORKFLOW_TARGET_WORLD is specidied, then WORKFLOW_POSTGRES_URL, WORKFLOW_POSTGRES_JOB_PREFIX and WORKFLOW_POSTGRES_WORKER_CONCURRENCY must be configured`,
// 			})
// 		}
// 	},
// )

const envs = z.parse(Envs, process.env);
export default envs;
