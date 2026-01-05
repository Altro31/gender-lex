import { defineConfig } from "nitro"

export default defineConfig({
    routes: { "/**": "./src/index.ts" },
    modules: ["workflow/nitro"],
    externals: { external: ["@workflow/world-postgres"] },

    plugins: ["nitro/plugins/start-pg-world.ts"],
})
