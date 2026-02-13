import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  cacheComponents: true,
  typescript: { ignoreBuildErrors: true },
  experimental: {
    browserDebugInfoInTerminal: true,
    authInterrupts: true,
    swcPlugins: [["@lingui/swc-plugin", {}]],
    rootParams: true,
  },
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
  logging: { fetches: { hmrRefreshes: true, fullUrl: true } },
};

export default nextConfig;
