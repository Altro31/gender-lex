import { defineNitroConfig } from "nitro/config"
import path from "path"

export default defineNitroConfig({
    srcDir: "src",
    serverEntry: "index.ts",
    modules: ["workflow/nitro"],
    alias: { "@": path.join(process.cwd(), "src") },
    rollupConfig: {
        onwarn: function (warning) {
            if (warning.code === "THIS_IS_UNDEFINED") {
                return
            }
            console.warn(warning.message)
        },
    },
    sourceMap: false,
})
