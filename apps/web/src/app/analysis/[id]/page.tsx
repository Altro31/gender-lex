"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	AlertTriangle,
	ArrowLeft,
	Calendar,
	CheckCircle,
	Clock,
	Download,
	Eye,
	EyeOff,
	Settings,
	Share2,
	User,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Types based on Prisma schema
interface BiasedTerm {
	content: string
	influencePercentage: number
	explanation: string
	category: string
}

interface BiasedMetaphor {
	content: string
	influencePercentage: number
	explanation: string
	historicalContext: string
}

interface AdditionalContextEvaluationItem {
	presence: boolean
	influencePercentage: number
	examples: string[]
	explanation: string
}

interface AdditionalContextGenderRepresentationAbsence {
	presence: boolean
	influencePercentage: number
	explanation: string
	affectedGroups: string[]
}

interface AdditionalContextIntersectionality {
	presence: boolean
	influencePercentage: number
	explanation: string
	excludedGroups: string[]
}

interface AdditionalContextEvaluation {
	stereotype: AdditionalContextEvaluationItem
	powerAsymmetry: AdditionalContextEvaluationItem
	genderRepresentationAbsence: AdditionalContextGenderRepresentationAbsence
	intersectionality: AdditionalContextIntersectionality
	systemicBiases: AdditionalContextEvaluationItem
}

interface ImpactAnalysisItem {
	affected: boolean
	description: string
}

interface ImpactAnalysis {
	accessToCare: ImpactAnalysisItem
	stigmatization: ImpactAnalysisItem
}

interface ModificationItem {
	originalFragment: string
	modifiedFragment: string
	reason: string
}

interface ModifiedAlternative {
	alternativeNumber: number
	alternativeText: string
	modificationsExplanation: ModificationItem[]
}

interface Analysis {
	id: string
	visibility: "public" | "private"
	status: "analyzing" | "done"
	userId?: string
	createdAt: string
	updatedAt: string
	originalText: string
	modifiedTextAlternatives: ModifiedAlternative[]
	biasedTerms: BiasedTerm[]
	biasedMetaphors: BiasedMetaphor[]
	additionalContextEvaluation?: AdditionalContextEvaluation
	impactAnalysis?: ImpactAnalysis
	conclusion?: string
}

// Mock data for demonstration
const mockAnalysis: Analysis = {
	id: "clx123456789",
	visibility: "private",
	status: "done",
	userId: "user123",
	createdAt: "2024-01-30T10:30:00Z",
	updatedAt: "2024-01-30T10:35:00Z",
	originalText:
		"Los médicos deben ser más empáticos con sus pacientes, especialmente las enfermeras que trabajan en pediatría. Es importante que los hombres en posiciones de liderazgo médico comprendan las necesidades específicas de las madres trabajadoras en el sector salud.",
	biasedTerms: [
		{
			content: "los médicos",
			influencePercentage: 0.75,
			explanation:
				"Uso del masculino genérico que invisibiliza a las mujeres médicas",
			category: "stereotypical",
		},
		{
			content: "las enfermeras",
			influencePercentage: 0.85,
			explanation:
				"Asociación automática de la enfermería con el género femenino",
			category: "stereotypical",
		},
		{
			content: "madres trabajadoras",
			influencePercentage: 0.65,
			explanation:
				"Asume que solo las madres tienen responsabilidades de cuidado",
			category: "paternalistic",
		},
	],
	biasedMetaphors: [
		{
			content: "hombres en posiciones de liderazgo médico",
			influencePercentage: 0.8,
			explanation:
				"Refuerza la idea de que el liderazgo médico es naturalmente masculino",
			historicalContext:
				"Históricamente, la medicina ha sido dominada por hombres en posiciones de poder, excluyendo a las mujeres de roles de liderazgo",
		},
	],
	additionalContextEvaluation: {
		stereotype: {
			presence: true,
			influencePercentage: 0.78,
			examples: [
				"Asociación enfermería-mujer",
				"Liderazgo médico-hombre",
			],
			explanation:
				"El texto perpetúa estereotipos de género en roles profesionales de la salud",
		},
		powerAsymmetry: {
			presence: true,
			influencePercentage: 0.7,
			examples: ["Jerarquía médico-enfermera", "Liderazgo masculino"],
			explanation:
				"Se evidencia una estructura de poder que favorece roles tradicionalmente masculinos",
		},
		genderRepresentationAbsence: {
			presence: true,
			influencePercentage: 0.65,
			explanation:
				"Ausencia de representación equitativa de géneros en diferentes roles",
			affectedGroups: [
				"Mujeres médicas",
				"Hombres enfermeros",
				"Personas no binarias",
			],
		},
		intersectionality: {
			presence: true,
			influencePercentage: 0.6,
			explanation:
				"No considera la intersección de género con otras identidades",
			excludedGroups: [
				"Madres solteras",
				"Padres cuidadores",
				"Personas LGBTQ+",
			],
		},
		systemicBiases: {
			presence: true,
			influencePercentage: 0.72,
			examples: [
				"Estructura jerárquica tradicional",
				"Roles de género normativos",
			],
			explanation:
				"Refleja sesgos sistémicos en la organización del sector salud",
		},
	},
	impactAnalysis: {
		accessToCare: {
			affected: true,
			description:
				"Los sesgos identificados pueden limitar el acceso equitativo a la atención médica al perpetuar estructuras de poder desiguales",
		},
		stigmatization: {
			affected: true,
			description:
				"El lenguaje utilizado puede contribuir a la estigmatización de profesionales que no se ajustan a los roles de género tradicionales",
		},
	},
	modifiedTextAlternatives: [
		{
			alternativeNumber: 1,
			alternativeText:
				"El personal médico debe ser más empático con sus pacientes, especialmente quienes trabajan en pediatría. Es importante que las personas en posiciones de liderazgo médico comprendan las necesidades específicas de las familias trabajadoras en el sector salud.",
			modificationsExplanation: [
				{
					originalFragment: "Los médicos",
					modifiedFragment: "El personal médico",
					reason: "Uso de lenguaje inclusivo que no asume género",
				},
				{
					originalFragment: "las enfermeras",
					modifiedFragment: "quienes trabajan",
					reason: "Eliminación del sesgo de género en la profesión de enfermería",
				},
				{
					originalFragment: "los hombres en posiciones de liderazgo",
					modifiedFragment: "las personas en posiciones de liderazgo",
					reason: "Lenguaje neutro que no asume género en roles de liderazgo",
				},
				{
					originalFragment: "madres trabajadoras",
					modifiedFragment: "familias trabajadoras",
					reason: "Inclusión de todas las estructuras familiares y responsabilidades de cuidado",
				},
			],
		},
		{
			alternativeNumber: 2,
			alternativeText:
				"Los profesionales de la salud deben mostrar mayor empatía hacia sus pacientes, independientemente de su especialidad. Es fundamental que el liderazgo médico comprenda las necesidades de todo el personal que combina responsabilidades laborales y familiares.",
			modificationsExplanation: [
				{
					originalFragment: "Los médicos... las enfermeras",
					modifiedFragment:
						"Los profesionales de la salud... independientemente de su especialidad",
					reason: "Eliminación de la jerarquización y segmentación por género de las profesiones",
				},
				{
					originalFragment:
						"los hombres en posiciones de liderazgo médico",
					modifiedFragment: "el liderazgo médico",
					reason: "Neutralización del género en posiciones de autoridad",
				},
				{
					originalFragment: "madres trabajadoras",
					modifiedFragment:
						"todo el personal que combina responsabilidades laborales y familiares",
					reason: "Inclusión universal sin asumir género o estructura familiar específica",
				},
			],
		},
	],
	conclusion:
		"El análisis revela múltiples sesgos de género que perpetúan estereotipos profesionales y estructuras de poder tradicionales en el sector salud. Se recomienda adoptar un lenguaje más inclusivo y cuestionar las asunciones de género en roles profesionales para promover un ambiente más equitativo.",
}

export default function AnalysisDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const [showSensitiveContent, setShowSensitiveContent] = useState(true)

	// In a real app, you would fetch the analysis data based on params.id
	const analysis = mockAnalysis

	const getStatusConfig = (status: string) => {
		switch (status) {
			case "analyzing":
				return {
					label: "Analizando",
					color: "bg-blue-100 text-blue-800",
					icon: Clock,
				}
			case "done":
				return {
					label: "Completado",
					color: "bg-green-100 text-green-800",
					icon: CheckCircle,
				}
			default:
				return {
					label: "Desconocido",
					color: "bg-gray-100 text-gray-800",
					icon: AlertTriangle,
				}
		}
	}

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "paternalistic":
				return "bg-red-100 text-red-800"
			case "stereotypical":
				return "bg-orange-100 text-orange-800"
			case "reproductiveExclusion":
				return "bg-purple-100 text-purple-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getCategoryLabel = (category: string) => {
		switch (category) {
			case "paternalistic":
				return "Paternalista"
			case "stereotypical":
				return "Estereotípico"
			case "reproductiveExclusion":
				return "Exclusión Reproductiva"
			default:
				return category
		}
	}

	const statusConfig = getStatusConfig(analysis.status)
	const StatusIcon = statusConfig.icon

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-4 mb-4">
						<Link href="/analysis">
							<Button variant="ghost" size="sm" className="gap-2">
								<ArrowLeft className="h-4 w-4" />
								Volver a Análisis
							</Button>
						</Link>
					</div>

					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								Detalles del Análisis
							</h1>
							<div className="flex items-center gap-4 text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									{new Date(
										analysis.createdAt,
									).toLocaleDateString("es-ES", {
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
								<div className="flex items-center gap-2">
									<User className="h-4 w-4" />
									ID: {analysis.id}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Badge className={statusConfig.color}>
								<StatusIcon className="h-3 w-3 mr-1" />
								{statusConfig.label}
							</Badge>
							<Badge
								variant={
									analysis.visibility === "public"
										? "default"
										: "secondary"
								}
							>
								{analysis.visibility === "public"
									? "Público"
									: "Privado"}
							</Badge>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 bg-transparent"
							>
								<Download className="h-4 w-4" />
								Exportar
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 bg-transparent"
							>
								<Share2 className="h-4 w-4" />
								Compartir
							</Button>
						</div>
					</div>
				</div>

				{/* Content */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="overview">Resumen</TabsTrigger>
						<TabsTrigger value="terms">Términos</TabsTrigger>
						<TabsTrigger value="context">Contexto</TabsTrigger>
						<TabsTrigger value="alternatives">
							Alternativas
						</TabsTrigger>
						<TabsTrigger value="impact">Impacto</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						{/* Original Text */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<Settings className="h-5 w-5" />
										Texto Original
									</CardTitle>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											setShowSensitiveContent(
												!showSensitiveContent,
											)
										}
										className="gap-2"
									>
										{showSensitiveContent ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
										{showSensitiveContent
											? "Ocultar"
											: "Mostrar"}
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{showSensitiveContent ? (
									<div className="bg-gray-50 rounded-lg p-4">
										<p className="text-gray-900 leading-relaxed">
											{analysis.originalText}
										</p>
									</div>
								) : (
									<div className="bg-gray-100 rounded-lg p-4 text-center">
										<p className="text-gray-500">
											Contenido oculto por privacidad
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Summary Stats */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<Card>
								<CardContent className="p-4">
									<div className="text-2xl font-bold text-red-600">
										{analysis.biasedTerms.length}
									</div>
									<div className="text-sm text-gray-600">
										Términos Sesgados
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="text-2xl font-bold text-orange-600">
										{analysis.biasedMetaphors.length}
									</div>
									<div className="text-sm text-gray-600">
										Metáforas Sesgadas
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="text-2xl font-bold text-blue-600">
										{
											analysis.modifiedTextAlternatives
												.length
										}
									</div>
									<div className="text-sm text-gray-600">
										Alternativas
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
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
									<div className="text-sm text-gray-600">
										Influencia Promedio
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Conclusion */}
						{analysis.conclusion && (
							<Card>
								<CardHeader>
									<CardTitle>Conclusión</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-700 leading-relaxed">
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
								<CardTitle>
									Términos Sesgados Identificados
								</CardTitle>
								<CardDescription>
									Palabras o frases que contienen sesgos de
									género detectados en el texto
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{analysis.biasedTerms.map((term, index) => (
									<div
										key={index}
										className="border rounded-lg p-4 space-y-3"
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<span className="font-medium text-lg">
													"{term.content}"
												</span>
												<Badge
													className={getCategoryColor(
														term.category,
													)}
												>
													{getCategoryLabel(
														term.category,
													)}
												</Badge>
											</div>
											<div className="text-right">
												<div className="text-sm text-gray-600">
													Influencia
												</div>
												<div className="text-lg font-bold text-red-600">
													{Math.round(
														term.influencePercentage *
															100,
													)}
													%
												</div>
											</div>
										</div>
										<Progress
											value={
												term.influencePercentage * 100
											}
											className="h-2"
										/>
										<p className="text-gray-700 text-sm">
											{term.explanation}
										</p>
									</div>
								))}
							</CardContent>
						</Card>

						{/* Biased Metaphors */}
						<Card>
							<CardHeader>
								<CardTitle>Metáforas Sesgadas</CardTitle>
								<CardDescription>
									Expresiones metafóricas que perpetúan sesgos
									de género
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{analysis.biasedMetaphors.map(
									(metaphor, index) => (
										<div
											key={index}
											className="border rounded-lg p-4 space-y-3"
										>
											<div className="flex items-center justify-between">
												<span className="font-medium text-lg">
													"{metaphor.content}"
												</span>
												<div className="text-right">
													<div className="text-sm text-gray-600">
														Influencia
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
												value={
													metaphor.influencePercentage *
													100
												}
												className="h-2"
											/>
											<div className="space-y-2">
												<div>
													<h4 className="font-medium text-sm text-gray-700">
														Explicación:
													</h4>
													<p className="text-gray-700 text-sm">
														{metaphor.explanation}
													</p>
												</div>
												<div>
													<h4 className="font-medium text-sm text-gray-700">
														Contexto Histórico:
													</h4>
													<p className="text-gray-700 text-sm">
														{
															metaphor.historicalContext
														}
													</p>
												</div>
											</div>
										</div>
									),
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Context Tab */}
					<TabsContent value="context" className="space-y-6">
						{analysis.additionalContextEvaluation && (
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Stereotype */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<div
												className={`w-3 h-3 rounded-full ${analysis.additionalContextEvaluation.stereotype.presence ? "bg-red-500" : "bg-green-500"}`}
											/>
											Estereotipos
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600">
												Influencia
											</span>
											<span className="font-bold">
												{Math.round(
													analysis
														.additionalContextEvaluation
														.stereotype
														.influencePercentage *
														100,
												)}
												%
											</span>
										</div>
										<Progress
											value={
												analysis
													.additionalContextEvaluation
													.stereotype
													.influencePercentage * 100
											}
										/>
										<p className="text-sm text-gray-700">
											{
												analysis
													.additionalContextEvaluation
													.stereotype.explanation
											}
										</p>
										{analysis.additionalContextEvaluation
											.stereotype.examples.length > 0 && (
											<div>
												<h4 className="font-medium text-sm text-gray-700 mb-2">
													Ejemplos:
												</h4>
												<ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
													{analysis.additionalContextEvaluation.stereotype.examples.map(
														(example, i) => (
															<li key={i}>
																{example}
															</li>
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
												className={`w-3 h-3 rounded-full ${analysis.additionalContextEvaluation.powerAsymmetry.presence ? "bg-red-500" : "bg-green-500"}`}
											/>
											Asimetría de Poder
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600">
												Influencia
											</span>
											<span className="font-bold">
												{Math.round(
													analysis
														.additionalContextEvaluation
														.powerAsymmetry
														.influencePercentage *
														100,
												)}
												%
											</span>
										</div>
										<Progress
											value={
												analysis
													.additionalContextEvaluation
													.powerAsymmetry
													.influencePercentage * 100
											}
										/>
										<p className="text-sm text-gray-700">
											{
												analysis
													.additionalContextEvaluation
													.powerAsymmetry.explanation
											}
										</p>
										{analysis.additionalContextEvaluation
											.powerAsymmetry.examples.length >
											0 && (
											<div>
												<h4 className="font-medium text-sm text-gray-700 mb-2">
													Ejemplos:
												</h4>
												<ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
													{analysis.additionalContextEvaluation.powerAsymmetry.examples.map(
														(example, i) => (
															<li key={i}>
																{example}
															</li>
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
												className={`w-3 h-3 rounded-full ${analysis.additionalContextEvaluation.genderRepresentationAbsence.presence ? "bg-red-500" : "bg-green-500"}`}
											/>
											Ausencia de Representación
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600">
												Influencia
											</span>
											<span className="font-bold">
												{Math.round(
													analysis
														.additionalContextEvaluation
														.genderRepresentationAbsence
														.influencePercentage *
														100,
												)}
												%
											</span>
										</div>
										<Progress
											value={
												analysis
													.additionalContextEvaluation
													.genderRepresentationAbsence
													.influencePercentage * 100
											}
										/>
										<p className="text-sm text-gray-700">
											{
												analysis
													.additionalContextEvaluation
													.genderRepresentationAbsence
													.explanation
											}
										</p>
										{analysis.additionalContextEvaluation
											.genderRepresentationAbsence
											.affectedGroups.length > 0 && (
											<div>
												<h4 className="font-medium text-sm text-gray-700 mb-2">
													Grupos Afectados:
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
												className={`w-3 h-3 rounded-full ${analysis.additionalContextEvaluation.intersectionality.presence ? "bg-red-500" : "bg-green-500"}`}
											/>
											Interseccionalidad
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600">
												Influencia
											</span>
											<span className="font-bold">
												{Math.round(
													analysis
														.additionalContextEvaluation
														.intersectionality
														.influencePercentage *
														100,
												)}
												%
											</span>
										</div>
										<Progress
											value={
												analysis
													.additionalContextEvaluation
													.intersectionality
													.influencePercentage * 100
											}
										/>
										<p className="text-sm text-gray-700">
											{
												analysis
													.additionalContextEvaluation
													.intersectionality
													.explanation
											}
										</p>
										{analysis.additionalContextEvaluation
											.intersectionality.excludedGroups
											.length > 0 && (
											<div>
												<h4 className="font-medium text-sm text-gray-700 mb-2">
													Grupos Excluidos:
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
												className={`w-3 h-3 rounded-full ${analysis.additionalContextEvaluation.systemicBiases.presence ? "bg-red-500" : "bg-green-500"}`}
											/>
											Sesgos Sistémicos
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600">
												Influencia
											</span>
											<span className="font-bold">
												{Math.round(
													analysis
														.additionalContextEvaluation
														.systemicBiases
														.influencePercentage *
														100,
												)}
												%
											</span>
										</div>
										<Progress
											value={
												analysis
													.additionalContextEvaluation
													.systemicBiases
													.influencePercentage * 100
											}
										/>
										<p className="text-sm text-gray-700">
											{
												analysis
													.additionalContextEvaluation
													.systemicBiases.explanation
											}
										</p>
										{analysis.additionalContextEvaluation
											.systemicBiases.examples.length >
											0 && (
											<div>
												<h4 className="font-medium text-sm text-gray-700 mb-2">
													Ejemplos:
												</h4>
												<ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
													{analysis.additionalContextEvaluation.systemicBiases.examples.map(
														(example, i) => (
															<li key={i}>
																{example}
															</li>
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
						{analysis.modifiedTextAlternatives.map(
							(alternative, index) => (
								<Card key={index}>
									<CardHeader>
										<CardTitle>
											Alternativa{" "}
											{alternative.alternativeNumber}
										</CardTitle>
										<CardDescription>
											Versión modificada del texto
											original sin sesgos de género
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="bg-green-50 border border-green-200 rounded-lg p-4">
											<p className="text-gray-900 leading-relaxed">
												{alternative.alternativeText}
											</p>
										</div>

										<Separator />

										<div>
											<h4 className="font-medium text-gray-900 mb-3">
												Modificaciones Realizadas:
											</h4>
											<div className="space-y-3">
												{alternative.modificationsExplanation.map(
													(mod, modIndex) => (
														<div
															key={modIndex}
															className="border rounded-lg p-3 space-y-2"
														>
															<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																<div>
																	<h5 className="text-sm font-medium text-red-700 mb-1">
																		Original:
																	</h5>
																	<p className="text-sm bg-red-50 p-2 rounded">
																		"
																		{
																			mod.originalFragment
																		}
																		"
																	</p>
																</div>
																<div>
																	<h5 className="text-sm font-medium text-green-700 mb-1">
																		Modificado:
																	</h5>
																	<p className="text-sm bg-green-50 p-2 rounded">
																		"
																		{
																			mod.modifiedFragment
																		}
																		"
																	</p>
																</div>
															</div>
															<div>
																<h5 className="text-sm font-medium text-gray-700 mb-1">
																	Razón:
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
							),
						)}
					</TabsContent>

					{/* Impact Tab */}
					<TabsContent value="impact" className="space-y-6">
						{analysis.impactAnalysis && (
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<div
												className={`w-3 h-3 rounded-full ${analysis.impactAnalysis.accessToCare.affected ? "bg-red-500" : "bg-green-500"}`}
											/>
											Acceso a la Atención
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<Badge
													className={
														analysis.impactAnalysis
															.accessToCare
															.affected
															? "bg-red-100 text-red-800"
															: "bg-green-100 text-green-800"
													}
												>
													{analysis.impactAnalysis
														.accessToCare.affected
														? "Afectado"
														: "No Afectado"}
												</Badge>
											</div>
											<p className="text-gray-700 text-sm leading-relaxed">
												{
													analysis.impactAnalysis
														.accessToCare
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
												className={`w-3 h-3 rounded-full ${analysis.impactAnalysis.stigmatization.affected ? "bg-red-500" : "bg-green-500"}`}
											/>
											Estigmatización
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<Badge
													className={
														analysis.impactAnalysis
															.stigmatization
															.affected
															? "bg-red-100 text-red-800"
															: "bg-green-100 text-green-800"
													}
												>
													{analysis.impactAnalysis
														.stigmatization.affected
														? "Afectado"
														: "No Afectado"}
												</Badge>
											</div>
											<p className="text-gray-700 text-sm leading-relaxed">
												{
													analysis.impactAnalysis
														.stigmatization
														.description
												}
											</p>
										</div>
									</CardContent>
								</Card>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
