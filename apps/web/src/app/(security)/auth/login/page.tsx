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
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth/auth-client"
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons"
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.email) {
			newErrors.email = "El correo electrónico es requerido"
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "El correo electrónico no es válido"
		}

		if (!formData.password) {
			newErrors.password = "La contraseña es requerida"
		} else if (formData.password.length < 6) {
			newErrors.password =
				"La contraseña debe tener al menos 6 caracteres"
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
		await authClient.signIn.email({
			...formData,
			callbackURL: process.env.NEXT_PUBLIC_UI_URL,
		})
	}

	const handleSocialLogin = (provider: "google" | "github") => {
		authClient.signIn.social({
			provider,
			callbackURL: process.env.NEXT_PUBLIC_UI_URL,
		})
	}
	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Back Button */}
				<div className="mb-6">
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
					<CardHeader className="space-y-1 pb-2">
						<div className="flex justify-center mb-1">
							<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
								<Lock className="h-6 w-6 text-white" />
							</div>
						</div>
						<CardTitle className="text-2xl font-bold text-center text-gray-900">
							Iniciar Sesión
						</CardTitle>
						<CardDescription className="text-center text-gray-600">
							Ingresa a tu cuenta para continuar
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Social Login Buttons */}
						<div className="space-y-3">
							<Button
								variant="outline"
								className="w-full h-11 gap-3 hover:bg-gray-50 bg-transparent"
								onClick={() => handleSocialLogin("google")}
							>
								<SiGoogle className="size-5" />
								Continuar con Google
							</Button>
							<Button
								variant="outline"
								className="w-full h-11 gap-3 hover:bg-gray-50 bg-transparent"
								onClick={() => handleSocialLogin("github")}
							>
								<SiGithub className="size-5" />
								Continuar con GitHub
							</Button>
						</div>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-gray-500">
									O continúa con email
								</span>
							</div>
						</div>

						{/* Login Form */}
						<form onSubmit={handleSubmit} className="space-y-4">
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
										placeholder="Tu contraseña"
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
								{errors.password && (
									<p className="text-sm text-red-600">
										{errors.password}
									</p>
								)}
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="remember"
										checked={formData.rememberMe}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												rememberMe: checked as boolean,
											})
										}
									/>
									<Label
										htmlFor="remember"
										className="text-sm text-gray-600"
									>
										Recordarme
									</Label>
								</div>
								<Link
									href="/auth/forgot-password"
									className="text-sm text-blue-600 hover:text-blue-800"
								>
									¿Olvidaste tu contraseña?
								</Link>
							</div>

							<Button
								type="submit"
								className="w-full h-11 bg-blue-600 hover:bg-blue-700"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Iniciando sesión...
									</div>
								) : (
									"Iniciar Sesión"
								)}
							</Button>
						</form>

						<div className="text-center">
							<p className="text-sm text-gray-600">
								¿No tienes una cuenta?{" "}
								<Link
									href="/auth/register"
									className="text-blue-600 hover:text-blue-800 font-medium"
								>
									Regístrate aquí
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center text-xs text-gray-500">
					<p>
						Al continuar, aceptas nuestros{" "}
						<Link
							href="/terms"
							className="text-blue-600 hover:text-blue-800"
						>
							Términos de Servicio
						</Link>{" "}
						y{" "}
						<Link
							href="/privacy"
							className="text-blue-600 hover:text-blue-800"
						>
							Política de Privacidad
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
