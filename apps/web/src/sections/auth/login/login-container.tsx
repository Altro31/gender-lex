import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import LoginForm from "@/sections/auth/login/form/login-form"
import LoginFormContainer from "@/sections/auth/login/form/login-form-container"
import { signInSocial } from "@/services/auth"
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons"
import { ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

export default function LoginContainer() {
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
							<div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
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
								onClick={async () => {
									"use server"
									await signInSocial("google")
								}}
							>
								<SiGoogle className="size-5" />
								Continuar con Google
							</Button>
							<Button
								variant="outline"
								className="w-full h-11 gap-3 hover:bg-gray-50 bg-transparent"
								onClick={async () => {
									"use server"
									await signInSocial("github")
								}}
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
						<LoginFormContainer>
							<LoginForm />
						</LoginFormContainer>
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
