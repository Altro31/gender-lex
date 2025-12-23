import { z } from 'zod'

const Envs = z.object({
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
})

const envs = z.parse(Envs, process.env)
export default envs
