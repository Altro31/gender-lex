import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	experimental: {
		cacheComponents: true,
		reactCompiler: true,
		nodeMiddleware: true,
		browserDebugInfoInTerminal: true,
		clientSegmentCache: true,
		devtoolSegmentExplorer: true,
		turbopackPersistentCaching: true,
	},
}

export default nextConfig
