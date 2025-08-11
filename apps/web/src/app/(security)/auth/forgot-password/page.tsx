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
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
				<div className="w-full max-w-md">
					<Card className="border-0 shadow-xl">
						<CardHeader className="space-y-1 pb-6 text-center">
							<div className="mb-4 flex justify-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
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
							<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
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
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
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

				<Card className="border-0 shadow-xl">
					<CardHeader className="space-y-1 pb-6">
						<div className="mb-4 flex justify-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
								<Mail className="h-6 w-6 text-white" />
							</div>
						</div>
						<CardTitle className="text-center text-2xl font-bold text-gray-900">
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
									<Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
									<Input
										id="email"
										type="email"
										placeholder="tu@ejemplo.com"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										className={`h-11 pl-10 ${error ? "border-red-500" : ""}`}
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
								className="h-11 w-full bg-blue-600 hover:bg-blue-700"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center gap-2">
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
									className="font-medium text-blue-600 hover:text-blue-800"
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
