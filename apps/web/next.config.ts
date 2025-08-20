import envs from "@/lib/env/env-server" with { type: "macro" }
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
	experimental: {
		reactCompiler: true,
		nodeMiddleware: true,
		browserDebugInfoInTerminal: false,
		clientSegmentCache: true,
		devtoolSegmentExplorer: true,
		authInterrupts: true,
	} as any,
	rewrites: async () => [
		{
			source: "/api/:path*",
			destination: `${envs.API_URL}/api/:path*`,
		},
	],
}

const withNextIntl = createNextIntlPlugin({
	requestConfig: "./src/locales/request.ts",
})
export default withNextIntl(nextConfig)
