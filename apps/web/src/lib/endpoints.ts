import envs from "@/lib/env/env-server"

export const endpoints = {
	auth: {
		google: {
			callback: `${envs.API_URL}/auth/google/callback`,
		},
	},
	ai: {
		analysis: {
			prepare: `${envs.API_URL}/ai/analysis/prepare`,
			start: `${envs.API_URL}/ai/analysis/start/:id`,
			root: `${envs.API_URL}/ai/analysis`,
			id: `${envs.API_URL}/ai/analysis/:id`,
		},
	},
	request: {
		root: `${envs.API_URL}/request`,
		details: `${envs.API_URL}/request/:id`,
	},
} as const
