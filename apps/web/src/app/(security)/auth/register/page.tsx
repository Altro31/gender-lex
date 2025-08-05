"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/auth-client"
import {
	ArrowLeft,
	Check,
	Eye,
	EyeOff,
	Lock,
	Mail,
	User
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function RegisterPage() {
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		acceptTerms: false,
		newsletter: false,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = "El nombre es requerido"
		} else if (formData.name.trim().length < 2) {
			newErrors.name = "El nombre debe tener al menos 2 caracteres"
		}

		if (!formData.email) {
			newErrors.email = "El correo electrónico es requerido"
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "El correo electrónico no es válido"
		}

		if (!formData.password) {
			newErrors.password = "La contraseña es requerida"
		} else if (formData.password.length < 8) {
			newErrors.password =
				"La contraseña debe tener al menos 8 caracteres"
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
			newErrors.password =
				"La contraseña debe contener al menos una mayúscula, una minúscula y un número"
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Confirma tu contraseña"
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Las contraseñas no coinciden"
		}

		if (!formData.acceptTerms) {
			newErrors.acceptTerms = "Debes aceptar los términos y condiciones"
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

		const { error } = await authClient.signUp.email({
			...formData,
			callbackURL: process.env.NEXT_PUBLIC_UI_URL,
		})
		if (error) {
			toast.error(error.message)
		} else {
			toast.success("User registered successfully")
			router.push("/")
		}
	}

	const handleSocialRegister = (provider: "google" | "github") => {
		authClient.signIn.social({
			provider,
			callbackURL: process.env.NEXT_PUBLIC_UI_URL,
		})
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

	const passwordStrength = getPasswordStrength(formData.password)

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
		<div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Back Button */}
				<div className="mb-1">
					<Link href="/">
						<Button
							variant="ghost"
							size="sm"
							className="gap-2 text-gray-600 hover:text-gray-900"
						>
							<ArrowLeft className="h-4 w-4" />
							Volver al inicio
						</Button>
					</Link>
				</div>

				<Card className="shadow-xl border-0">
					<CardHeader className="space-y-1">
						<div className="flex justify-center mb-4">
							<div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
								<User className="h-6 w-6 text-white" />
							</div>
						</div>
						<CardTitle className="text-2xl font-bold text-center text-gray-900">
							Crear Cuenta
						</CardTitle>
						<CardDescription className="text-center text-gray-600">
							Únete a nuestra plataforma en segundos
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Register Form */}
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Nombre Completo</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										id="name"
										type="text"
										placeholder="Tu nombre completo"
										value={formData.name}
										onChange={(e) =>
											setFormData({
												...formData,
												name: e.target.value,
											})
										}
										className={`pl-10 h-11 ${errors.name ? "border-red-500" : ""}`}
									/>
								</div>
								{errors.name && (
									<p className="text-sm text-red-600">
										{errors.name}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">
									Correo Electrónico
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										id="email"
										type="email"
										placeholder="tu@ejemplo.com"
										value={formData.email}
										onChange={(e) =>
											setFormData({
												...formData,
												email: e.target.value,
											})
										}
										className={`pl-10 h-11 ${errors.email ? "border-red-500" : ""}`}
									/>
								</div>
								{errors.email && (
									<p className="text-sm text-red-600">
										{errors.email}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Contraseña</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										id="password"
										type={
											showPassword ? "text" : "password"
										}
										placeholder="Crea una contraseña segura"
										value={formData.password}
										onChange={(e) =>
											setFormData({
												...formData,
												password: e.target.value,
											})
										}
										className={`pl-10 pr-10 h-11 ${errors.password ? "border-red-500" : ""}`}
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
										onClick={() =>
											setShowPassword(!showPassword)
										}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>

								{/* Password Strength Indicator */}
								{formData.password && (
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<div className="flex-1 bg-gray-200 rounded-full h-2">
												<div
													className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
													style={{
														width: `${(passwordStrength / 5) * 100}%`,
													}}
												/>
											</div>
											<span className="text-xs text-gray-600">
												{getStrengthText(
													passwordStrength,
												)}
											</span>
										</div>
									</div>
								)}

								{errors.password && (
									<p className="text-sm text-red-600">
										{errors.password}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">
									Confirmar Contraseña
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										id="confirmPassword"
										type={
											showConfirmPassword
												? "text"
												: "password"
										}
										placeholder="Confirma tu contraseña"
										value={formData.confirmPassword}
										onChange={(e) =>
											setFormData({
												...formData,
												confirmPassword: e.target.value,
											})
										}
										className={`pl-10 pr-10 h-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
										onClick={() =>
											setShowConfirmPassword(
												!showConfirmPassword,
											)
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
									formData.password ===
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

							<div className="space-y-3">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="terms"
										checked={formData.acceptTerms}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												acceptTerms: checked as boolean,
											})
										}
										className={
											errors.acceptTerms
												? "border-red-500"
												: ""
										}
									/>
									<Label
										htmlFor="terms"
										className="text-sm text-gray-600 leading-5 *:contents"
									>
										Acepto los{" "}
										<Link
											href="/terms"
											className="text-blue-600 hover:text-blue-800 "
										>
											Términos de Servicio
										</Link>{" "}
										y la{" "}
										<Link
											href="/privacy"
											className="text-blue-600 hover:text-blue-800"
										>
											Política de Privacidad
										</Link>
									</Label>
								</div>
								{errors.acceptTerms && (
									<p className="text-sm text-red-600">
										{errors.acceptTerms}
									</p>
								)}

								<div className="flex items-center space-x-2">
									<Checkbox
										id="newsletter"
										checked={formData.newsletter}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												newsletter: checked as boolean,
											})
										}
									/>
									<Label
										htmlFor="newsletter"
										className="text-sm text-gray-600"
									>
										Quiero recibir noticias y
										actualizaciones por email
									</Label>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full h-11 bg-purple-600 hover:bg-purple-700"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Creando cuenta...
									</div>
								) : (
									"Crear Cuenta"
								)}
							</Button>
						</form>

						<div className="text-center">
							<p className="text-sm text-gray-600">
								¿Ya tienes una cuenta?{" "}
								<Link
									href="/auth/login"
									className="text-purple-600 hover:text-purple-800 font-medium"
								>
									Inicia sesión aquí
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center text-xs text-gray-500">
					<p>
						Al registrarte, confirmas que tienes al menos 18 años de
						edad
					</p>
				</div>
			</div>
		</div>
	)
}
