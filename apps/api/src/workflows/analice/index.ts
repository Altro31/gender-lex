import type { WorkflowInput } from './lib/types'
import { extractContent } from './steps/extract-content'

export async function analiceWorkflow(input: WorkflowInput) {
	'use workflow'

	const content = await extractContent(input)
}
