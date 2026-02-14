import { defineConfig } from "nitro"

export default defineConfig({
    routes: { "/**": "./src/index.ts" },
    modules: ["workflow/nitro"],
    plugins: ["nitro/plugins/start-pg-world.ts"],
    experimental: { tsconfigPaths: true },
    externals: {
        traceInclude: ["@workflow/world-postgres"],
        external: [
            "workflow",
            "workflow/*",
            "@workflow/core",
            "@workflow/core/*",
            "@workflow/errors",
            "@workflow/errors/*",
            "@workflow/utils",
            "@workflow/utils/*",
            "@workflow/world",
            "@workflow/world/*",
            "@workflow/world-local",
            "@workflow/world-local/*",
            "@workflow/world-postgres",
            "@workflow/world-postgres/*",
            "@workflow/world-vercel",
            "@workflow/world-vercel/*",
        ],
    },
})
