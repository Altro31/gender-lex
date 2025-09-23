import Elysia, { env } from "elysia"
import z from "zod"

export type EnvTypes = ReturnType<typeof parseEnvs>
function parseEnvs(envs: any) {
    return z
        .object({
            PORT: z.coerce.number().int().min(0).default(4000),
            GROQ_API_KEY: z.string(),
            PDF_SERVICES_CLIENT_ID: z.string(),
            PDF_SERVICES_CLIENT_SECRET: z.string(),
            BETTER_AUTH_SECRET: z.string().min(32),
            BETTER_AUTH_URL: z.string().url(),
            UI_URL: z.string().url(),
            AUTH_GOOGLE_ID: z.string(),
            AUTH_GOOGLE_SECRET: z.string(),
            AUTH_GITHUB_ID: z.string(),
            AUTH_GITHUB_SECRET: z.string(),
            ENCRYPTION_KEY: z.string().length(32),
            UMLS_API_KEY: z.string(),
            UMLS_API_URL: z.string().url(),
        })
        .parse(envs)
}

export default new Elysia({ name: "env" }).decorate("env", parseEnvs(env))
