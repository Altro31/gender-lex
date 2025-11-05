import envs from "@/lib/env/env-server" with { type: "macro" }
import type { NextConfig } from "next"
import path from "path"
import { withWorkflow } from "workflow/next"

const nextConfig: NextConfig = {
	reactCompiler: true,
	cacheComponents: true,
	experimental: {
		browserDebugInfoInTerminal: true,
		clientSegmentCache: true,
		authInterrupts: true,
		swcPlugins: [["@lingui/swc-plugin", {}]],
		rootParams: true,
	},
	redirects: async () => [],
	rewrites: async () => [
		{ source: "/api/:path*", destination: `${envs.API_URL}/api/:path*` },
	],
	turbopack: {
		resolveExtensions: [
			".mdx",
			".tsx",
			".ts",
			".jsx",
			".js",
			".mjs",
			".json",
			".po",
		],
		rules: { "*.po": { loaders: ["@lingui/loader"], as: "*.js" } },
		root: path.join(import.meta.dirname, "..", ".."),
	},
}

export default withWorkflow(nextConfig)
