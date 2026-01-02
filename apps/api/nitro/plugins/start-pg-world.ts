import { defineNitroPlugin } from 'nitro/~internal/runtime/plugin'
export default defineNitroPlugin(async () => {
	if (process.env.WORKFLOW_TARGET_WORLD === '@workflow/world-postgres') {
		// Dynamic import to avoid edge runtime bundling issues
		const { getWorld } = await import('workflow/runtime')
		await getWorld().start?.()
		console.log('Postgres World started')
	}
})
