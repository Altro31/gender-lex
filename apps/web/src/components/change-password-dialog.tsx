"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

interface ChangePasswordDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function ChangePasswordDialog({
	open,
	onOpenChange,
}: ChangePasswordDialogProps) {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.currentPassword) {
			newErrors.currentPassword = "La contraseña actual es requerida"
		}

		if (!formData.newPassword) {
			newErrors.newPassword = "La nueva contraseña es requerida"
		} else if (formData.newPassword.length < 8) {
			newErrors.newPassword =
				"La contraseña debe tener al menos 8 caracteres"
		} else if (
			!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)
		) {
			newErrors.newPassword =
				"La contraseña debe contener al menos una mayúscula, una minúscula y un número"
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Confirma tu nueva contraseña"
		} else if (formData.newPassword !== formData.confirmPassword) {
			newErrors.confirmPassword = "Las contraseñas no coinciden"
		}

		if (formData.currentPassword === formData.newPassword) {
			newErrors.newPassword =
				"La nueva contraseña debe ser diferente a la actual"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		setIsLoading(true)

		// Simulate API call
		setTimeout(() => {
			console.log("Password change request:", {
				currentPassword: formData.currentPassword,
			})
			setIsLoading(false)
			setFormData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			})
			setErrors({})
			onOpenChange(false)
			// Show success message or handle success
		}, 2000)
	}

	const handleCancel = () => {
		setFormData({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		})
		setErrors({})
		onOpenChange(false)
	}

	const getPasswordStrength = (password: string) => {
		let strength = 0
		if (password.length >= 8) strength++
		if (/[a-z]/.test(password)) strength++
		if (/[A-Z]/.test(password)) strength++
		if (/\d/.test(password)) strength++
		if (/[^a-zA-Z\d]/.test(password)) strength++
		return strength
	}

	const passwordStrength = getPasswordStrength(formData.newPassword)

	const getStrengthColor = (strength: number) => {
		if (strength <= 2) return "bg-red-500"
		if (strength <= 3) return "bg-yellow-500"
		return "bg-green-500"
	}

	const getStrengthText = (strength: number) => {
		if (strength <= 2) return "Débil"
		if (strength <= 3) return "Media"
		return "Fuerte"
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Lock className="h-5 w-5" />
						Cambiar Contraseña
					</DialogTitle>
					<DialogDescription>
						Ingresa tu contraseña actual y elige una nueva
						contraseña segura
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="currentPassword">
							Contraseña Actual
						</Label>
						<div className="relative">
							<Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<Input
								id="currentPassword"
								type={showCurrentPassword ? "text" : "password"}
								placeholder="Tu contraseña actual"
								value={formData.currentPassword}
								onChange={(e) =>
									setFormData({
										...formData,
										currentPassword: e.target.value,
									})
								}
								className={`pr-10 pl-10 ${errors.currentPassword ? "border-red-500" : ""}`}
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() =>
									setShowCurrentPassword(!showCurrentPassword)
								}
							>
								{showCurrentPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
						{errors.currentPassword && (
							<p className="text-sm text-red-600">
								{errors.currentPassword}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="newPassword">Nueva Contraseña</Label>
						<div className="relative">
							<Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<Input
								id="newPassword"
								type={showNewPassword ? "text" : "password"}
								placeholder="Tu nueva contraseña"
								value={formData.newPassword}
								onChange={(e) =>
									setFormData({
										...formData,
										newPassword: e.target.value,
									})
								}
								className={`pr-10 pl-10 ${errors.newPassword ? "border-red-500" : ""}`}
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() =>
									setShowNewPassword(!showNewPassword)
								}
							>
								{showNewPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>

						{/* Password Strength Indicator */}
						{formData.newPassword && (
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<div className="h-2 flex-1 rounded-full bg-gray-200">
										<div
											className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
											style={{
												width: `${(passwordStrength / 5) * 100}%`,
											}}
										/>
									</div>
									<span className="text-xs text-gray-600">
										{getStrengthText(passwordStrength)}
									</span>
								</div>
							</div>
						)}

						{errors.newPassword && (
							<p className="text-sm text-red-600">
								{errors.newPassword}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">
							Confirmar Nueva Contraseña
						</Label>
						<div className="relative">
							<Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Confirma tu nueva contraseña"
								value={formData.confirmPassword}
								onChange={(e) =>
									setFormData({
										...formData,
										confirmPassword: e.target.value,
									})
								}
								className={`pr-10 pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
							>
								{showConfirmPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
						{formData.confirmPassword &&
							formData.newPassword ===
								formData.confirmPassword && (
								<div className="flex items-center gap-2 text-green-600">
									<Check className="h-4 w-4" />
									<span className="text-sm">
										Las contraseñas coinciden
									</span>
								</div>
							)}
						{errors.confirmPassword && (
							<p className="text-sm text-red-600">
								{errors.confirmPassword}
							</p>
						)}
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							type="submit"
							disabled={isLoading}
							className="flex-1"
						>
							{isLoading ? (
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
									Cambiando...
								</div>
							) : (
								"Cambiar Contraseña"
							)}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							className="bg-transparent"
						>
							Cancelar
						</Button>
					</div>
				</form>

				{/* Security Tips */}
				<div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
					<h4 className="mb-2 font-medium text-blue-900">
						Consejos de Seguridad:
					</h4>
					<ul className="space-y-1 text-sm text-blue-800">
						<li>• Usa al menos 8 caracteres</li>
						<li>• Incluye mayúsculas, minúsculas y números</li>
						<li>• Evita información personal</li>
						<li>• No reutilices contraseñas de otras cuentas</li>
					</ul>
				</div>
			</DialogContent>
		</Dialog>
	)
}
