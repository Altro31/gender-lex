import { type } from "arktype"

const Envs = type({
	API_URL: "string.url = 'http://localhost:4000'",
	FLAG_REACT_SCAN: ["string", "=>", (value) => Boolean(value)],
	AUTH_GOOGLE_ID: "string",
	AUTH_GOOGLE_SECRET: "string",
	AUTH_GITHUB_ID: "string",
	AUTH_GITHUB_SECRET: "string",
	BETTER_AUTH_SECRET: "string",
	BETTER_AUTH_URL: "string.url",
	UI_URL: "string.url",
})

const envs = Envs.assert(process.env)
export default envs
