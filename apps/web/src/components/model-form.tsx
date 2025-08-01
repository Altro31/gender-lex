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
import { Eye, EyeOff } from "lucide-react"

interface Model {
	id: string
	name: string
	provider: string
	model: string
	apiKey: string
	endpoint?: string
	status: "active" | "inactive" | "error"
	createdAt: string
	lastUsed?: string
	description?: string
}

interface ModelFormProps {
	initialData?: Model
	onSubmit: (data: Omit<Model, "id" | "createdAt">) => void
	isEditing?: boolean
}

const providers = [
	{ value: "OpenAI", label: "OpenAI" },
	{ value: "Anthropic", label: "Anthropic" },
	{ value: "Google", label: "Google" },
	{ value: "Meta", label: "Meta" },
	{ value: "Cohere", label: "Cohere" },
	{ value: "Hugging Face", label: "Hugging Face" },
	{ value: "Local", label: "Local" },
	{ value: "Otro", label: "Otro" },
]

const modelsByProvider: Record<string, string[]> = {
	OpenAI: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-4o", "gpt-4o-mini"],
	Anthropic: [
		"claude-3-opus",
		"claude-3-sonnet",
		"claude-3-haiku",
		"claude-2",
	],
	Google: ["gemini-pro", "gemini-pro-vision", "palm-2"],
	Meta: ["llama-2-7b", "llama-2-13b", "llama-2-70b", "code-llama"],
	Cohere: ["command", "command-light", "command-nightly"],
	"Hugging Face": ["mistral-7b", "falcon-7b", "bloom"],
	Local: ["custom-model"],
	Otro: ["custom-model"],
}

export default function ModelForm({
	initialData,
	onSubmit,
	isEditing = false,
}: ModelFormProps) {
	const [formData, setFormData] = useState({
		name: initialData?.name || "",
		provider: initialData?.provider || "",
		model: initialData?.model || "",
		apiKey: initialData?.apiKey || "",
		endpoint: initialData?.endpoint || "",
		status: initialData?.status || ("active" as const),
		description: initialData?.description || "",
		lastUsed: initialData?.lastUsed,
	})

	const [showApiKey, setShowApiKey] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = "El nombre es requerido"
		}

		if (!formData.provider) {
			newErrors.provider = "El proveedor es requerido"
		}

		if (!formData.model) {
			newErrors.model = "El modelo es requerido"
		}

		if (formData.provider !== "Local" && !formData.apiKey.trim()) {
			newErrors.apiKey = "La clave API es requerida para este proveedor"
		}

		if (formData.provider === "Local" && !formData.endpoint.trim()) {
			newErrors.endpoint = "El endpoint es requerido para modelos locales"
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

	const handleProviderChange = (provider: string) => {
		setFormData({
			...formData,
			provider,
			model: "", // Reset model when provider changes
		})
	}

	const availableModels = formData.provider
		? modelsByProvider[formData.provider] || []
		: []

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="name">Nombre del Modelo *</Label>
					<Input
						id="name"
						value={formData.name}
						onChange={(e) =>
							setFormData({ ...formData, name: e.target.value })
						}
						placeholder="ej. GPT-4 Principal"
						className={errors.name ? "border-red-500" : ""}
					/>
					{errors.name && (
						<p className="text-sm text-red-600">{errors.name}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="provider">Proveedor *</Label>
					<Select
						value={formData.provider}
						onValueChange={handleProviderChange}
					>
						<SelectTrigger
							className={errors.provider ? "border-red-500" : ""}
						>
							<SelectValue placeholder="Selecciona un proveedor" />
						</SelectTrigger>
						<SelectContent>
							{providers.map((provider) => (
								<SelectItem
									key={provider.value}
									value={provider.value}
								>
									{provider.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.provider && (
						<p className="text-sm text-red-600">
							{errors.provider}
						</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="model">Modelo *</Label>
					<Select
						value={formData.model}
						onValueChange={(value) =>
							setFormData({ ...formData, model: value })
						}
						disabled={!formData.provider}
					>
						<SelectTrigger
							className={errors.model ? "border-red-500" : ""}
						>
							<SelectValue placeholder="Selecciona un modelo" />
						</SelectTrigger>
						<SelectContent>
							{availableModels.map((model) => (
								<SelectItem key={model} value={model}>
									{model}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.model && (
						<p className="text-sm text-red-600">{errors.model}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="status">Estado</Label>
					<Select
						value={formData.status}
						onValueChange={(
							value: "active" | "inactive" | "error",
						) => setFormData({ ...formData, status: value })}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="active">Activo</SelectItem>
							<SelectItem value="inactive">Inactivo</SelectItem>
							<SelectItem value="error">Error</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{formData.provider !== "Local" && (
				<div className="space-y-2">
					<Label htmlFor="apiKey">Clave API *</Label>
					<div className="relative">
						<Input
							id="apiKey"
							type={showApiKey ? "text" : "password"}
							value={formData.apiKey}
							onChange={(e) =>
								setFormData({
									...formData,
									apiKey: e.target.value,
								})
							}
							placeholder="Ingresa tu clave API"
							className={`pr-10 ${errors.apiKey ? "border-red-500" : ""}`}
						/>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
							onClick={() => setShowApiKey(!showApiKey)}
						>
							{showApiKey ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
					{errors.apiKey && (
						<p className="text-sm text-red-600">{errors.apiKey}</p>
					)}
				</div>
			)}

			{formData.provider === "Local" && (
				<div className="space-y-2">
					<Label htmlFor="endpoint">Endpoint *</Label>
					<Input
						id="endpoint"
						value={formData.endpoint}
						onChange={(e) =>
							setFormData({
								...formData,
								endpoint: e.target.value,
							})
						}
						placeholder="http://localhost:8080"
						className={errors.endpoint ? "border-red-500" : ""}
					/>
					{errors.endpoint && (
						<p className="text-sm text-red-600">
							{errors.endpoint}
						</p>
					)}
				</div>
			)}

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
					placeholder="Describe el propósito o uso de este modelo..."
					rows={3}
				/>
			</div>

			<div className="flex justify-end gap-3 pt-4">
				<Button type="submit">
					{isEditing ? "Actualizar Modelo" : "Crear Modelo"}
				</Button>
			</div>
		</form>
	)
}
