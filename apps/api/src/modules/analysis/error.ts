import { HttpTaggedError } from '@/lib/types/http-error'

export class AnalysisNotFoundError extends HttpTaggedError(
	'AnalysisNotFoundError',
) {
	override status = 404
	override statusText = 'Analysis not found'
}
