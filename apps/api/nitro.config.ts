import { defineConfig } from "nitro"

export default defineConfig({
    routes: { "/**": "./src/index.ts" },
    modules: ["workflow/nitro"],
    plugins: ["nitro/plugins/start-pg-world.ts"],
    experimental: { tsconfigPaths: true },
    externals: { traceInclude: ["@workflow/world-postgres"] },
})
