export async function register() {
	if (process.env.NEXT_RUNTIME !== 'edge') {
		// Dynamic import to avoid edge runtime bundling issues
		console.log('Starting Postgres World...')
		const { getWorld } = await import('workflow/runtime')
		await getWorld().start?.()
		console.log('Postgres World started')
	}
}
