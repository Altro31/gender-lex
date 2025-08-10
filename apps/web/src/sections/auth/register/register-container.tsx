import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import RegisterForm from "@/sections/auth/register/form/register-form"
import RegisterFormContainer from "@/sections/auth/register/form/register-form-container"
import { ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

export default function RegisterContainer() {
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
							Crear Cuenta
						</CardTitle>
						<CardDescription className="text-center text-gray-600">
							Únete a nuestra plataforma en segundos
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Register Form */}
						<RegisterFormContainer>
							<RegisterForm />
						</RegisterFormContainer>
						<div className="text-center">
							<p className="text-sm text-gray-600">
								¿Ya tienes una cuenta?{" "}
								<Link
									href="/auth/login"
									className="text-blue-600 hover:text-blue-800 font-medium"
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
