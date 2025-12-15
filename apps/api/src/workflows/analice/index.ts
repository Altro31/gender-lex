import { extractContent } from './steps/extract-content'

export async function analiceWorkflow(input: File | string) {
	'use workflow'

	const content = await extractContent(input)
}
