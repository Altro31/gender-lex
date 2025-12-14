import { HttpTaggedError } from '@/lib/types/http-error'

const AnalysisNotFoundBase = HttpTaggedError('AnalysisNotFoundError')

export class AnalysisNotFoundError extends AnalysisNotFoundBase {
	override status = 404
	override statusText = 'Analysis not found'
}
