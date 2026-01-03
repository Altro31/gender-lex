import { sleep } from 'workflow'

export async function testWorkflow() {
	'use workflow'

	await hello()

	await sleep('5s')

	await bye()

	return { ok: true }
}

export async function hello() {
	'use step'

	console.log('Hello from workflow 😅')
}

export async function bye() {
	'use step'

	console.log('Bye from workflow 😅')
}
