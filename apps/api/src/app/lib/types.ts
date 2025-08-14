import { Analysis } from '@repo/db/models'

export type RawAnalysis = Pick<
	Analysis,
	| 'originalText'
	| 'modifiedTextAlternatives'
	| 'biasedTerms'
	| 'biasedMetaphors'
	| 'additionalContextEvaluation'
	| 'impactAnalysis'
	| 'conclusion'
>
