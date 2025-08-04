import envs from "@/lib/env/env-server" with { type: "macro" }
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	experimental: {
		cacheComponents: true,
		reactCompiler: true,
		nodeMiddleware: true,
		browserDebugInfoInTerminal: false,
		clientSegmentCache: true,
		devtoolSegmentExplorer: true,
	} as any,
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${envs.API_URL}/api/:path*`,
			},
		]
	},
}

export default nextConfig
