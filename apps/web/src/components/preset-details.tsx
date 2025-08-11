"use client"

import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
	Calendar,
	Tag,
	Zap,
	Settings,
	Thermometer,
	Hash,
	Percent,
	Brain,
	MessageSquare,
} from "lucide-react"

interface ModelConfig {
	modelId: string
	modelName: string
	role: "primary" | "secondary" | "tertiary"
	parameters: {
		temperature: number
		maxTokens: number
		topP: number
		frequencyPenalty: number
		presencePenalty: number
		systemPrompt?: string
	}
}

interface Preset {
	id: string
	name: string
	description?: string
	category: string
	models: ModelConfig[]
	isActive: boolean
	createdAt: string
	lastUsed?: string
	usageCount: number
}

interface PresetDetailsProps {
	preset: Preset
}

export default function PresetDetails({ preset }: PresetDetailsProps) {
	const getRoleColor = (role: string) => {
		switch (role) {
			case "primary":
				return "bg-blue-100 text-blue-800"
			case "secondary":
				return "bg-green-100 text-green-800"
			case "tertiary":
				return "bg-purple-100 text-purple-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getRoleText = (role: string) => {
		switch (role) {
			case "primary":
				return "Principal"
			case "secondary":
				return "Secundario"
			case "tertiary":
				return "Terciario"
			default:
				return role
		}
	}

	const getParameterIcon = (param: string) => {
		switch (param) {
			case "temperature":
				return <Thermometer className="h-4 w-4" />
			case "maxTokens":
				return <Hash className="h-4 w-4" />
			case "topP":
				return <Percent className="h-4 w-4" />
			case "frequencyPenalty":
				return <Brain className="h-4 w-4" />
			case "presencePenalty":
				return <MessageSquare className="h-4 w-4" />
			default:
				return <Settings className="h-4 w-4" />
		}
	}

	const getParameterLabel = (param: string) => {
		switch (param) {
			case "temperature":
				return "Temperatura"
			case "maxTokens":
				return "Tokens Máximos"
			case "topP":
				return "Top P"
			case "frequencyPenalty":
				return "Penalización de Frecuencia"
			case "presencePenalty":
				return "Penalización de Presencia"
			default:
				return param
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-2xl font-semibold text-gray-900">
						{preset.name}
					</h3>
					<div className="mt-1 flex items-center gap-2">
						<Badge variant="outline">{preset.category}</Badge>
						<Badge
							className={
								preset.isActive
									? "bg-green-100 text-green-800"
									: "bg-gray-100 text-gray-800"
							}
						>
							{preset.isActive ? "Activo" : "Inactivo"}
						</Badge>
					</div>
				</div>
				<div className="text-right">
					<div className="text-2xl font-bold text-blue-600">
						{preset.usageCount}
					</div>
					<div className="text-sm text-gray-600">usos totales</div>
				</div>
			</div>

			{/* Description */}
			{preset.description && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Tag className="h-5 w-5" />
							Descripción
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-700">{preset.description}</p>
					</CardContent>
				</Card>
			)}

			{/* Models Configuration */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Zap className="h-5 w-5" />
						Configuración de Modelos
					</CardTitle>
					<CardDescription>
						Modelos y parámetros configurados en este preset
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{preset.models.map((model, index) => (
						<div
							key={index}
							className="space-y-4 rounded-lg border p-4"
						>
							{/* Model Header */}
							<div className="flex items-center justify-between">
								<div>
									<h4 className="text-lg font-semibold">
										{model.modelName}
									</h4>
									<p className="text-sm text-gray-600">
										ID: {model.modelId}
									</p>
								</div>
								<Badge className={getRoleColor(model.role)}>
									{getRoleText(model.role)}
								</Badge>
							</div>

							{/* Parameters Grid */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								{Object.entries(model.parameters).map(
									([key, value]) => {
										if (key === "systemPrompt") return null // Handle separately

										return (
											<div
												key={key}
												className="space-y-2"
											>
												<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
													{getParameterIcon(key)}
													{getParameterLabel(key)}
												</div>
												<div className="space-y-1">
													<div className="flex justify-between text-sm">
														<span className="text-gray-600">
															Valor:
														</span>
														<span className="font-mono font-medium">
															{value}
														</span>
													</div>
													{(key === "temperature" ||
														key === "topP" ||
														key ===
															"frequencyPenalty" ||
														key ===
															"presencePenalty") && (
														<Progress
															value={
																key ===
																"temperature"
																	? (value as number) *
																		50
																	: key ===
																		  "topP"
																		? (value as number) *
																			100
																		: ((value as number) +
																				2) *
																			25
															}
															className="h-2"
														/>
													)}
												</div>
											</div>
										)
									},
								)}
							</div>

							{/* System Prompt */}
							{model.parameters.systemPrompt && (
								<div className="space-y-2 border-t pt-4">
									<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
										<MessageSquare className="h-4 w-4" />
										Prompt del Sistema
									</div>
									<div className="rounded-lg bg-gray-50 p-3">
										<p className="text-sm whitespace-pre-wrap text-gray-700">
											{model.parameters.systemPrompt}
										</p>
									</div>
								</div>
							)}
						</div>
					))}
				</CardContent>
			</Card>

			{/* Usage Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Calendar className="h-5 w-5" />
						Información de Uso
					</CardTitle>
					<CardDescription>
						Estadísticas y fechas importantes
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700">
								Fecha de Creación
							</div>
							<p className="text-gray-900">
								{new Date(preset.createdAt).toLocaleDateString(
									"es-ES",
									{
										year: "numeric",
										month: "long",
										day: "numeric",
									},
								)}
							</p>
						</div>

						{preset.lastUsed && (
							<div className="space-y-2">
								<div className="text-sm font-medium text-gray-700">
									Último Uso
								</div>
								<p className="text-gray-900">
									{new Date(
										preset.lastUsed,
									).toLocaleDateString("es-ES", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						)}

						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700">
								Total de Usos
							</div>
							<p className="text-2xl font-bold text-gray-900">
								{preset.usageCount}
							</p>
						</div>
					</div>

					<div className="space-y-2">
						<div className="text-sm font-medium text-gray-700">
							ID del Preset
						</div>
						<p className="font-mono text-sm text-gray-900">
							{preset.id}
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Acciones Rápidas</CardTitle>
					<CardDescription>
						Operaciones comunes para este preset
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-3">
						<button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
							Usar Preset
						</button>
						<button className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
							Duplicar
						</button>
						<button className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
							Exportar Configuración
						</button>
						<button className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
							Probar Conexiones
						</button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
