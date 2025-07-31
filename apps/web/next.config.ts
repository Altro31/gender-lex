import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	experimental: {
		cacheComponents: true,
		reactCompiler: true,
		nodeMiddleware: true,
		browserDebugInfoInTerminal: false,
		clientSegmentCache: true,
		devtoolSegmentExplorer: true,
	},
}

export default nextConfig
