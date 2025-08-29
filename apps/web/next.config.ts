import envs from "@/lib/env/env-server" with { type: "macro" }
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
	typedRoutes: true,
	experimental: {
		reactCompiler: true,
		browserDebugInfoInTerminal: false,
		clientSegmentCache: true,
		devtoolSegmentExplorer: true,
		authInterrupts: true,
	},
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
export default withNextIntl(nextConfig as any)
