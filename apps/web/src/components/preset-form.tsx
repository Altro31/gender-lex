"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Plus, Settings } from "lucide-react"
import ModelConfigCard from "@/components/model-config-card"

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

interface PresetFormProps {
	initialData?: Preset
	onSubmit: (data: Omit<Preset, "id" | "createdAt" | "usageCount">) => void
	isEditing?: boolean
}

// Mock data for available models
const availableModels = [
	{ id: "1", name: "GPT-4 Principal", provider: "OpenAI" },
	{ id: "2", name: "Claude Sonnet", provider: "Anthropic" },
	{ id: "3", name: "Llama Local", provider: "Meta" },
	{ id: "4", name: "Gemini Pro", provider: "Google" },
]

const categories = [
	"Escritura",
	"Desarrollo",
	"Investigación",
	"Análisis",
	"Creatividad",
	"General",
]

const roleOptions = [
	{ value: "primary", label: "Principal" },
	{ value: "secondary", label: "Secundario" },
	{ value: "tertiary", label: "Terciario" },
]

export default function PresetForm({
	initialData,
	onSubmit,
	isEditing = false,
}: PresetFormProps) {
	const [formData, setFormData] = useState({
		name: initialData?.name || "",
		description: initialData?.description || "",
		category: initialData?.category || "",
		isActive: initialData?.isActive ?? true,
		models: initialData?.models || [],
		lastUsed: initialData?.lastUsed,
	})

	const [errors, setErrors] = useState<Record<string, string>>({})

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = "El nombre es requerido"
		}

		if (!formData.category) {
			newErrors.category = "La categoría es requerida"
		}

		if (formData.models.length === 0) {
			newErrors.models = "Debe agregar al menos un modelo"
		}

		// Validate that there's at least one primary model
		const primaryModels = formData.models.filter(
			(model) => model.role === "primary",
		)
		if (primaryModels.length === 0) {
			newErrors.primaryModel = "Debe tener al menos un modelo principal"
		}

		// Validate unique roles
		const roles = formData.models.map((model) => model.role)
		const uniqueRoles = new Set(roles)
		if (roles.length !== uniqueRoles.size) {
			newErrors.uniqueRoles =
				"No puede haber modelos duplicados con el mismo rol"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		onSubmit(formData)
	}

	const addModel = () => {
		const newModel: ModelConfig = {
			modelId: "",
			modelName: "",
			role: "secondary",
			parameters: {
				temperature: 0.7,
				maxTokens: 2000,
				topP: 0.9,
				frequencyPenalty: 0.0,
				presencePenalty: 0.0,
				systemPrompt: "",
			},
		}

		setFormData({
			...formData,
			models: [...formData.models, newModel],
		})
	}

	const removeModel = (index: number) => {
		setFormData({
			...formData,
			models: formData.models.filter((_, i) => i !== index),
		})
	}

	const updateModel = (index: number, updatedModel: ModelConfig) => {
		const updatedModels = [...formData.models]
		updatedModels[index] = updatedModel
		setFormData({
			...formData,
			models: updatedModels,
		})
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Basic Information */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						Información Básica
					</CardTitle>
					<CardDescription>
						Configuración general del preset
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="name">Nombre del Preset *</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								placeholder="ej. Análisis Creativo"
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && (
								<p className="text-sm text-red-600">
									{errors.name}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="category">Categoría *</Label>
							<Select
								value={formData.category}
								onValueChange={(value) =>
									setFormData({
										...formData,
										category: value,
									})
								}
							>
								<SelectTrigger
									className={
										errors.category ? "border-red-500" : ""
									}
								>
									<SelectValue placeholder="Selecciona una categoría" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem
											key={category}
											value={category}
										>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.category && (
								<p className="text-sm text-red-600">
									{errors.category}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Descripción</Label>
						<Textarea
							id="description"
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
							placeholder="Describe el propósito y uso de este preset..."
							rows={3}
						/>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							id="isActive"
							checked={formData.isActive}
							onCheckedChange={(checked) =>
								setFormData({ ...formData, isActive: checked })
							}
						/>
						<Label htmlFor="isActive">Preset activo</Label>
					</div>
				</CardContent>
			</Card>

			{/* Models Configuration */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg">
								Configuración de Modelos
							</CardTitle>
							<CardDescription>
								Agrega y configura los modelos que formarán
								parte de este preset
							</CardDescription>
						</div>
						<Button
							type="button"
							onClick={addModel}
							size="sm"
							className="flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Agregar Modelo
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{errors.models && (
						<p className="text-sm text-red-600">{errors.models}</p>
					)}
					{errors.primaryModel && (
						<p className="text-sm text-red-600">
							{errors.primaryModel}
						</p>
					)}
					{errors.uniqueRoles && (
						<p className="text-sm text-red-600">
							{errors.uniqueRoles}
						</p>
					)}

					{formData.models.length === 0 ? (
						<div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center">
							<Settings className="mx-auto mb-4 h-12 w-12 text-gray-400" />
							<p className="mb-4 text-gray-600">
								No hay modelos configurados
							</p>
							<Button
								type="button"
								onClick={addModel}
								variant="outline"
							>
								<Plus className="mr-2 h-4 w-4" />
								Agregar Primer Modelo
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{formData.models.map((model, index) => (
								<div key={index} className="relative">
									<ModelConfigCard
										model={model}
										availableModels={availableModels}
										roleOptions={roleOptions}
										onUpdate={(updatedModel) =>
											updateModel(index, updatedModel)
										}
										onRemove={() => removeModel(index)}
										canRemove={formData.models.length > 1}
									/>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<div className="flex justify-end gap-3 pt-4">
				<Button type="submit">
					{isEditing ? "Actualizar Preset" : "Crear Preset"}
				</Button>
			</div>
		</form>
	)
}
