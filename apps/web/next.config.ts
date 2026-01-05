import envs from "@/lib/env/env-server" with { type: "macro" };
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  typescript: { ignoreBuildErrors: true },
  experimental: {
    browserDebugInfoInTerminal: true,
    authInterrupts: true,
    swcPlugins: [["@lingui/swc-plugin", {}]],
    rootParams: true,
  },
  rewrites: async () => [
    {
      source: "/api/auth/:path*",
      destination: `${envs.API_URL}/api/auth/:path*`,
    },
    {
      source: "/api/proxy/:path*",
      destination: `${envs.API_URL}/:path*`,
    },
  ],
  serverExternalPackages: ["pg", "@repo/types", "@workflow/world-postgres"],
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
  // async headers() {
  // 	return [
  // 		{
  // 			source: '/(.*)',
  // 			headers: [
  // 				{ key: 'X-Content-Type-Options', value: 'nosniff' },
  // 				{ key: 'X-Frame-Options', value: 'DENY' },
  // 				{
  // 					key: 'Referrer-Policy',
  // 					value: 'strict-origin-when-cross-origin',
  // 				},
  // 			],
  // 		},
  // 		{
  // 			source: '/sw.js',
  // 			headers: [
  // 				{
  // 					key: 'Content-Type',
  // 					value: 'application/javascript; charset=utf-8',
  // 				},
  // 				{
  // 					key: 'Cache-Control',
  // 					value: 'no-cache, no-store, must-revalidate',
  // 				},
  // 				{
  // 					key: 'Content-Security-Policy',
  // 					value: "default-src 'self'; script-src 'self'",
  // 				},
  // 			],
  // 		},
  // 	]
  // },
};

export default nextConfig;
