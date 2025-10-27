import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import AnalysisContentOriginalText from '@/sections/analysis/details/content/analysis-content-original-text'
import { startAnalysis } from '@/services/analysis'
import { t } from '@lingui/core/macro'

interface Props {
	params: PageProps<'/[locale]/analysis/[id]'>['params']
}

export default async function AnalysisContent({ params }: Props) {
	const { id } = await params
	const analysis = await startAnalysis(id)

	return (
		<>
			{/* Overview Tab */}
			<TabsContent value="overview" className="space-y-6">
				{/* Original Text */}
				<AnalysisContentOriginalText text={analysis.originalText} />

				{/* Summary Stats */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
					<Card>
						<CardContent>
							<div className="text-sm text-gray-600">
								{t`Biased terms`}
							</div>
							<div className="text-2xl font-bold text-red-600">
								{analysis.biasedTerms.length}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent>
							<div className="text-sm text-gray-600">
								{t`Biased Metaphors`}
							</div>
							<div className="text-2xl font-bold text-orange-600">
								{analysis.biasedMetaphors.length}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent>
							<div className="text-sm text-gray-600">
								{t`Alternatives`}
							</div>
							<div className="text-2xl font-bold text-blue-600">
								{analysis.modifiedTextAlternatives.length}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent>
							<div className="text-sm text-gray-600">
								{t`Average Influence`}
							</div>
							<div className="text-2xl font-bold text-green-600">
								{analysis.additionalContextEvaluation
									? Math.round(
											(Object.values(
												analysis.additionalContextEvaluation,
											).reduce(
												(acc, item) =>
													acc +
													(item.influencePercentage ||
														0),
												0,
											) /
												5) *
												100,
										)
									: 0}
								%
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Conclusion */}
				{analysis.conclusion && (
					<Card>
						<CardHeader>
							<CardTitle>{t`Conclusion`}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="leading-relaxed text-gray-700">
								{analysis.conclusion}
							</p>
						</CardContent>
					</Card>
				)}
			</TabsContent>

			{/* Terms Tab */}
			<TabsContent value="terms" className="space-y-6">
				{/* Biased Terms */}
				<Card>
					<CardHeader>
						<CardTitle>{t`Identified Biased Terms`}</CardTitle>
						<CardDescription>
							{t`Words or phrases that contain gender bias detected in the text`}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{analysis.biasedTerms.map((term, index) => (
							<div
								key={index}
								className="space-y-3 rounded-lg border p-4"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<span className="text-lg font-medium">
											"{term.content}"
										</span>
									</div>
									<div className="text-right">
										<div className="text-sm text-gray-600">
											{t`Influence`}
										</div>
										<div className="text-lg font-bold text-red-600">
											{Math.round(
												term.influencePercentage * 100,
											)}
											%
										</div>
									</div>
								</div>
								<Progress
									value={term.influencePercentage * 100}
									className="h-2"
								/>
								<p className="text-sm text-gray-700">
									{term.explanation}
								</p>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Biased Metaphors */}
				<Card>
					<CardHeader>
						<CardTitle>{t`Biased Metaphors`}</CardTitle>
						<CardDescription>
							{t`Metaphorical expressions that perpetuate gender biases`}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{analysis.biasedMetaphors.map((metaphor, index) => (
							<div
								key={index}
								className="space-y-3 rounded-lg border p-4"
							>
								<div className="flex items-center justify-between">
									<span className="text-lg font-medium">
										"{metaphor.content}"
									</span>
									<div className="text-right">
										<div className="text-sm text-gray-600">
											{t`Influence`}
										</div>
										<div className="text-lg font-bold text-orange-600">
											{Math.round(
												metaphor.influencePercentage *
													100,
											)}
											%
										</div>
									</div>
								</div>
								<Progress
									value={metaphor.influencePercentage * 100}
									className="h-2"
								/>
								<div className="space-y-2">
									<div>
										<h4 className="text-sm font-medium text-gray-700">
											{t`Explanation`}:
										</h4>
										<p className="text-sm text-gray-700">
											{metaphor.explanation}
										</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-gray-700">
											{t`Historical Context`}:
										</h4>
										<p className="text-sm text-gray-700">
											{metaphor.historicalContext}
										</p>
									</div>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</TabsContent>

			{/* Context Tab */}
			<TabsContent value="context" className="space-y-6">
				{analysis.additionalContextEvaluation && (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Stereotype */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div
										className={`h-3 w-3 rounded-full ${analysis.additionalContextEvaluation.stereotype.presence ? 'bg-red-500' : 'bg-green-500'}`}
									/>
									{t`Stereotypes`}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">
										{t`Influence`}
									</span>
									<span className="font-bold">
										{Math.round(
											analysis.additionalContextEvaluation
												.stereotype
												.influencePercentage * 100,
										)}
										%
									</span>
								</div>
								<Progress
									value={
										analysis.additionalContextEvaluation
											.stereotype.influencePercentage *
										100
									}
								/>
								<p className="text-sm text-gray-700">
									{
										analysis.additionalContextEvaluation
											.stereotype.explanation
									}
								</p>
								{analysis.additionalContextEvaluation.stereotype
									.examples.length > 0 && (
									<div>
										<h4 className="mb-2 text-sm font-medium text-gray-700">
											{t`Examples`}:
										</h4>
										<ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
											{analysis.additionalContextEvaluation.stereotype.examples.map(
												(example, i) => (
													<li key={i}>{example}</li>
												),
											)}
										</ul>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Power Asymmetry */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div
										className={`h-3 w-3 rounded-full ${analysis.additionalContextEvaluation.powerAsymmetry.presence ? 'bg-red-500' : 'bg-green-500'}`}
									/>
									{t`Power Asymmetry`}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">
										{t`Influence`}
									</span>
									<span className="font-bold">
										{Math.round(
											analysis.additionalContextEvaluation
												.powerAsymmetry
												.influencePercentage * 100,
										)}
										%
									</span>
								</div>
								<Progress
									value={
										analysis.additionalContextEvaluation
											.powerAsymmetry
											.influencePercentage * 100
									}
								/>
								<p className="text-sm text-gray-700">
									{
										analysis.additionalContextEvaluation
											.powerAsymmetry.explanation
									}
								</p>
								{analysis.additionalContextEvaluation
									.powerAsymmetry.examples.length > 0 && (
									<div>
										<h4 className="mb-2 text-sm font-medium text-gray-700">
											{t`Examples`}:
										</h4>
										<ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
											{analysis.additionalContextEvaluation.powerAsymmetry.examples.map(
												(example, i) => (
													<li key={i}>{example}</li>
												),
											)}
										</ul>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Gender Representation Absence */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div
										className={`h-3 w-3 rounded-full ${analysis.additionalContextEvaluation.genderRepresentationAbsence.presence ? 'bg-red-500' : 'bg-green-500'}`}
									/>
									{t`Absence of Representation`}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">
										{t`Influence`}
									</span>
									<span className="font-bold">
										{Math.round(
											analysis.additionalContextEvaluation
												.genderRepresentationAbsence
												.influencePercentage * 100,
										)}
										%
									</span>
								</div>
								<Progress
									value={
										analysis.additionalContextEvaluation
											.genderRepresentationAbsence
											.influencePercentage * 100
									}
								/>
								<p className="text-sm text-gray-700">
									{
										analysis.additionalContextEvaluation
											.genderRepresentationAbsence
											.explanation
									}
								</p>
								{analysis.additionalContextEvaluation
									.genderRepresentationAbsence.affectedGroups
									.length > 0 && (
									<div>
										<h4 className="mb-2 text-sm font-medium text-gray-700">
											{t`Affected Groups`}:
										</h4>
										<div className="flex flex-wrap gap-2">
											{analysis.additionalContextEvaluation.genderRepresentationAbsence.affectedGroups.map(
												(group, i) => (
													<Badge
														key={i}
														variant="outline"
													>
														{group}
													</Badge>
												),
											)}
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Intersectionality */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div
										className={`h-3 w-3 rounded-full ${analysis.additionalContextEvaluation.intersectionality.presence ? 'bg-red-500' : 'bg-green-500'}`}
									/>
									{t`Intersectionality`}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">
										{t`Influence`}
									</span>
									<span className="font-bold">
										{Math.round(
											analysis.additionalContextEvaluation
												.intersectionality
												.influencePercentage * 100,
										)}
										%
									</span>
								</div>
								<Progress
									value={
										analysis.additionalContextEvaluation
											.intersectionality
											.influencePercentage * 100
									}
								/>
								<p className="text-sm text-gray-700">
									{
										analysis.additionalContextEvaluation
											.intersectionality.explanation
									}
								</p>
								{analysis.additionalContextEvaluation
									.intersectionality.excludedGroups.length >
									0 && (
									<div>
										<h4 className="mb-2 text-sm font-medium text-gray-700">
											{t`Excluded Groups`}:
										</h4>
										<div className="flex flex-wrap gap-2">
											{analysis.additionalContextEvaluation.intersectionality.excludedGroups.map(
												(group, i) => (
													<Badge
														key={i}
														variant="outline"
													>
														{group}
													</Badge>
												),
											)}
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Systemic Biases */}
						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div
										className={`h-3 w-3 rounded-full ${analysis.additionalContextEvaluation.systemicBiases.presence ? 'bg-red-500' : 'bg-green-500'}`}
									/>
									{t`Systemic Biases`}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">
										{t`Influence`}
									</span>
									<span className="font-bold">
										{Math.round(
											analysis.additionalContextEvaluation
												.systemicBiases
												.influencePercentage * 100,
										)}
										%
									</span>
								</div>
								<Progress
									value={
										analysis.additionalContextEvaluation
											.systemicBiases
											.influencePercentage * 100
									}
								/>
								<p className="text-sm text-gray-700">
									{
										analysis.additionalContextEvaluation
											.systemicBiases.explanation
									}
								</p>
								{analysis.additionalContextEvaluation
									.systemicBiases.examples.length > 0 && (
									<div>
										<h4 className="mb-2 text-sm font-medium text-gray-700">
											{t`Examples`}:
										</h4>
										<ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
											{analysis.additionalContextEvaluation.systemicBiases.examples.map(
												(example, i) => (
													<li key={i}>{example}</li>
												),
											)}
										</ul>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				)}
			</TabsContent>

			{/* Alternatives Tab */}
			<TabsContent value="alternatives" className="space-y-6">
				{analysis.modifiedTextAlternatives.map((alternative, index) => (
					<Card key={index}>
						<CardHeader>
							<CardTitle>
								{t`Alternative`} {alternative.alternativeNumber}
							</CardTitle>
							<CardDescription>
								{t`Modified version of the original text without gender bias`}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="rounded-lg border border-green-200 bg-green-50 p-4">
								<p className="leading-relaxed text-gray-900">
									{alternative.alternativeText}
								</p>
							</div>

							<Separator />

							<div>
								<h4 className="mb-3 font-medium text-gray-900">
									{t`Modifications Made`}:
								</h4>
								<div className="space-y-3">
									{alternative.modificationsExplanation.map(
										(mod, modIndex) => (
											<div
												key={modIndex}
												className="space-y-2 rounded-lg border p-3"
											>
												<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
													<div>
														<h5 className="mb-1 text-sm font-medium text-red-700">
															{t`Original`}:
														</h5>
														<p className="rounded bg-red-50 p-2 text-sm">
															"
															{
																mod.originalFragment
															}
															"
														</p>
													</div>
													<div>
														<h5 className="mb-1 text-sm font-medium text-green-700">
															{t`Modified`}:
														</h5>
														<p className="rounded bg-green-50 p-2 text-sm">
															"
															{
																mod.modifiedFragment
															}
															"
														</p>
													</div>
												</div>
												<div>
													<h5 className="mb-1 text-sm font-medium text-gray-700">
														{t`Reason`}:
													</h5>
													<p className="text-sm text-gray-600">
														{mod.reason}
													</p>
												</div>
											</div>
										),
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</TabsContent>

			{/* Impact Tab */}
			<TabsContent value="impact" className="space-y-6">
				{analysis.impactAnalysis && (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div
										className={`h-3 w-3 rounded-full ${analysis.impactAnalysis.accessToCare.affected ? 'bg-red-500' : 'bg-green-500'}`}
									/>
									{t`Access to Care`}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Badge
											className={
												analysis.impactAnalysis
													.accessToCare.affected
													? 'bg-red-100 text-red-800'
													: 'bg-green-100 text-green-800'
											}
										>
											{analysis.impactAnalysis
												.accessToCare.affected
												? t`Affected`
												: t`No Affected`}
										</Badge>
									</div>
									<p className="text-sm leading-relaxed text-gray-700">
										{
											analysis.impactAnalysis.accessToCare
												.description
										}
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div
										className={`h-3 w-3 rounded-full ${analysis.impactAnalysis.stigmatization.affected ? 'bg-red-500' : 'bg-green-500'}`}
									/>
									{t`Stigmatization`}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Badge
											className={
												analysis.impactAnalysis
													.stigmatization.affected
													? 'bg-red-100 text-red-800'
													: 'bg-green-100 text-green-800'
											}
										>
											{analysis.impactAnalysis
												.stigmatization.affected
												? t`Affected`
												: t`No Affected`}
										</Badge>
									</div>
									<p className="text-sm leading-relaxed text-gray-700">
										{
											analysis.impactAnalysis
												.stigmatization.description
										}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</TabsContent>
		</>
	)
}
