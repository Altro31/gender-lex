import { definePlugin } from "nitro"

export default definePlugin(async () => {
    if (process.env.WORKFLOW_TARGET_WORLD === "@workflow/world-postgres") {
        // Dynamic import to avoid edge runtime bundling issues
        const { getWorld } = await import("workflow/runtime")
        await getWorld().start?.()
        console.log("Postgres World started")
    }
})
