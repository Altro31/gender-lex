import envs from '@/lib/env/env-server' with { type: 'macro' }
import type { NextConfig } from 'next'
import path from 'path'
import { withWorkflow } from 'workflow/next'

const nextConfig: NextConfig = {
	reactCompiler: true,
	cacheComponents: true,
	typescript: { ignoreBuildErrors: true },
	experimental: {
		browserDebugInfoInTerminal: true,
		authInterrupts: true,
		swcPlugins: [['@lingui/swc-plugin', {}]],
		rootParams: true,
		turbopackFileSystemCacheForDev: true,
		typedEnv: true,
	},
	rewrites: async () => [
		{ source: '/api/:path*', destination: `${envs.API_URL}/api/:path*` },
	],
	serverExternalPackages: ['pg', '@repo/types'],
	turbopack: {
		resolveExtensions: [
			'.mdx',
			'.tsx',
			'.ts',
			'.jsx',
			'.js',
			'.mjs',
			'.json',
			'.po',
		],
		rules: { '*.po': { loaders: ['@lingui/loader'], as: '*.js' } },
		root: path.join(import.meta.dirname, '..', '..'),
	},
}

export default withWorkflow(nextConfig)
