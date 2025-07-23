import type { Analysis } from "@zenstackhq/runtime/models"

export function calculateOverallBias(analysis: Analysis) {
	const termsBias =
		analysis.biasedTerms.reduce(
			(sum, term) => sum + term.influencePercentage,
			0,
		) / analysis.biasedTerms.length
	const metaphorsBias =
		analysis.biasedMetaphors.reduce(
			(sum, metaphor) => sum + metaphor.influencePercentage,
			0,
		) / analysis.biasedMetaphors.length
	const contextBias =
		((analysis.additionalContextEvaluation.stereotype.presence
			? analysis.additionalContextEvaluation.stereotype
					.influencePercentage
			: 0) +
			(analysis.additionalContextEvaluation.powerAsymmetry.presence
				? analysis.additionalContextEvaluation.powerAsymmetry
						.influencePercentage
				: 0) +
			(analysis.additionalContextEvaluation.genderRepresentationAbsence
				.presence
				? analysis.additionalContextEvaluation
						.genderRepresentationAbsence.influencePercentage
				: 0)) /
		3

	return (termsBias + metaphorsBias + contextBias) / 3
}
