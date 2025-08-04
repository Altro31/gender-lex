"use client"

import type React from "react"

import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		if (!email) {
			setError("El correo electrónico es requerido")
			return
		}

		if (!/\S+@\S+\.\S+/.test(email)) {
			setError("El correo electrónico no es válido")
			return
		}

		setIsLoading(true)

		// Simulate API call
		setTimeout(() => {
			console.log("Password reset request for:", email)
			setIsLoading(false)
			setIsSuccess(true)
		}, 2000)
	}

	if (isSuccess) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<Card className="shadow-xl border-0">
						<CardHeader className="space-y-1 pb-6 text-center">
							<div className="flex justify-center mb-4">
								<div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
									<CheckCircle className="h-6 w-6 text-white" />
								</div>
							</div>
							<CardTitle className="text-2xl font-bold text-gray-900">
								¡Email Enviado!
							</CardTitle>
							<CardDescription className="text-gray-600">
								Hemos enviado las instrucciones para restablecer
								tu contraseña a <strong>{email}</strong>
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p className="text-sm text-blue-800">
									Revisa tu bandeja de entrada y sigue las
									instrucciones del email. Si no lo
									encuentras, revisa tu carpeta de spam.
								</p>
							</div>
							<div className="space-y-3">
								<Link href="/auth/login">
									<Button className="w-full">
										Volver al Inicio de Sesión
									</Button>
								</Link>
								<Button
									variant="outline"
									className="w-full bg-transparent"
									onClick={() => {
										setIsSuccess(false)
										setEmail("")
									}}
								>
									Enviar a otro email
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Back Button */}
				<div className="mb-6">
					<Link href="/auth/login">
						<Button
							variant="ghost"
							size="sm"
							className="gap-2 text-gray-600 hover:text-gray-900"
						>
							<ArrowLeft className="h-4 w-4" />
							Volver al inicio de sesión
						</Button>
					</Link>
				</div>

				<Card className="shadow-xl border-0">
					<CardHeader className="space-y-1 pb-6">
						<div className="flex justify-center mb-4">
							<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
								<Mail className="h-6 w-6 text-white" />
							</div>
						</div>
						<CardTitle className="text-2xl font-bold text-center text-gray-900">
							¿Olvidaste tu contraseña?
						</CardTitle>
						<CardDescription className="text-center text-gray-600">
							No te preocupes, te enviaremos instrucciones para
							restablecerla
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
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
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										className={`pl-10 h-11 ${error ? "border-red-500" : ""}`}
									/>
								</div>
								{error && (
									<p className="text-sm text-red-600">
										{error}
									</p>
								)}
							</div>

							<Button
								type="submit"
								className="w-full h-11 bg-blue-600 hover:bg-blue-700"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Enviando...
									</div>
								) : (
									"Enviar Instrucciones"
								)}
							</Button>
						</form>

						<div className="text-center">
							<p className="text-sm text-gray-600">
								¿Recordaste tu contraseña?{" "}
								<Link
									href="/auth/login"
									className="text-blue-600 hover:text-blue-800 font-medium"
								>
									Inicia sesión
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
