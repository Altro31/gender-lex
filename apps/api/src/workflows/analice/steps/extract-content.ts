import { isFile } from '@/lib/file'
import { ExtractorService } from '@/modules/extractor/service'
import { Effect } from 'effect'
import type { WorkflowInput } from '../lib/types'

export async function extractContent({
	input,
	selectedPreset,
	session,
}: WorkflowInput) {
	'use step'
	const program = Effect.gen(function* () {
		const extractorService = yield* ExtractorService
		const text = isFile(input)
			? yield* extractorService.extractPDFText(input)
			: input
		return text
	}).pipe(ExtractorService.provide)

	return Effect.runPromise(program)
}
