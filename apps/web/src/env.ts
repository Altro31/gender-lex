import { type } from "arktype"

const Envs = type({
	API_URL: "string.url = 'http://localhost:4000'",
	AUTH_TRUST_HOST: ["string", "=>", (value) => Boolean(value)],
	AUTH_SECRET: "string >= 32",
	AUTH_GOOGLE_ID: "string >= 60",
	AUTH_GOOGLE_SECRET: "string >= 32",
	FLAG_REACT_SCAN: ["string", "=>", (value) => Boolean(value)],
})

const envs = Envs.assert(process.env)
export default envs
