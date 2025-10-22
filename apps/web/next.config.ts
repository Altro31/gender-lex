import envs from "@/lib/env/env-server" with { type: "macro" }
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
	reactCompiler: true,
	cacheComponents: true,
	experimental: {
		browserDebugInfoInTerminal: false,
		clientSegmentCache: true,
		authInterrupts: true,
		swcPlugins: [],
		globalNotFound: true,
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
