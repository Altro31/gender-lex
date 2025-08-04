import * as v from "valibot"

const Envs = v.object({
	API_URL: v.pipe(v.string(), v.url()),
	FLAG_REACT_SCAN: v.pipe(
		v.string(),
		v.transform((value) => Boolean(value)),
	),
	AUTH_GOOGLE_ID: v.string(),
	AUTH_GOOGLE_SECRET: v.string(),
	AUTH_GITHUB_ID: v.string(),
	AUTH_GITHUB_SECRET: v.string(),
	BETTER_AUTH_SECRET: v.string(),
	BETTER_AUTH_URL: v.pipe(v.string(), v.url()),
	UI_URL: v.pipe(v.string(), v.url()),
})

const envs = v.parse(Envs, process.env)
export default envs
