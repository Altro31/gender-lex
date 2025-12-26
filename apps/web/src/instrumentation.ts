import { schema } from '@workflow/world-postgres'

export async function register() {
	if (process.env.NEXT_RUNTIME !== 'edge') {
		console.log(schema)
		// Dynamic import to avoid edge runtime bundling issues
		console.log('Starting Postgres World...')
		const { getWorld } = await import('workflow/runtime')
		await getWorld().start?.()
		console.log('Postgres World started')
	}
}
