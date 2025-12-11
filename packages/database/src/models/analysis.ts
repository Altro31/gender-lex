import { Schema } from 'effect'
import {
	AnalysisStatus,
	InputSource,
	Visibility,
	type Analysis as ZenAnalysis,
} from '../generated/models'
import { PresetId } from './preset'
import { UserId } from './user'

const AdditionalContextEvaluationItem = Schema.Struct({
	influencePercentage: Schema.Number,
	explanation: Schema.String,
	presence: Schema.Boolean,
	examples: Schema.String.pipe(Schema.Array, Schema.mutable),
})

const ImpactAnalysisItem = Schema.Struct({
	affected: Schema.Boolean,
	description: Schema.String,
})

export type AnalysisId = typeof AnalysisId.Type
export const AnalysisId = Schema.String.pipe(Schema.brand('AnalysisId'))

export class Analysis
	extends Schema.TaggedClass<Analysis>()('Analysis', {
		id: AnalysisId,
		name: Schema.NullOr(Schema.String),
		createdAt: Schema.Date,
		updatedAt: Schema.Date,
		userId: Schema.NullOr(UserId),
		originalText: Schema.String,
		modifiedTextAlternatives: Schema.Array(
			Schema.Struct({
				alternativeNumber: Schema.Number,
				alternativeText: Schema.String,
				modificationsExplanation: Schema.Struct({
					modifiedFragment: Schema.String,
					originalFragment: Schema.String,
					reason: Schema.String,
				}).pipe(Schema.Array, Schema.mutable),
			}),
		).pipe(Schema.mutable),
		biasedTerms: Schema.Struct({
			content: Schema.String,
			influencePercentage: Schema.Number,
			explanation: Schema.String,
			category: Schema.String,
		}).pipe(Schema.Array, Schema.mutable),
		biasedMetaphors: Schema.Struct({
			content: Schema.String,
			influencePercentage: Schema.Number,
			explanation: Schema.String,
			historicalContext: Schema.String,
		}).pipe(Schema.Array, Schema.mutable),
		additionalContextEvaluation: Schema.Struct({
			stereotype: AdditionalContextEvaluationItem,
			powerAsymmetry: AdditionalContextEvaluationItem,
			genderRepresentationAbsence: Schema.Struct({
				influencePercentage: Schema.Number,
				explanation: Schema.String,
				presence: Schema.Boolean,
				affectedGroups: Schema.String.pipe(
					Schema.Array,
					Schema.mutable,
				),
			}),
			intersectionality: Schema.Struct({
				influencePercentage: Schema.Number,
				explanation: Schema.String,
				presence: Schema.Boolean,
				excludedGroups: Schema.String.pipe(
					Schema.Array,
					Schema.mutable,
				),
			}),
			systemicBiases: AdditionalContextEvaluationItem,
		}).pipe(Schema.NullOr),
		impactAnalysis: Schema.Struct({
			accessToCare: ImpactAnalysisItem,
			stigmatization: ImpactAnalysisItem,
		}).pipe(Schema.NullOr),
		conclusion: Schema.NullOr(Schema.String),
		visibility: Schema.Enums(Visibility),
		status: Schema.Enums(AnalysisStatus),
		inputSource: Schema.Enums(InputSource),
		presetId: PresetId,
	})
	implements ZenAnalysis {}
