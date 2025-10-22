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
import { useTranslations } from "next-intl"
import { Link } from "@/locales/navigation"

export default function RegisterContainer() {
	const t = useTranslations()
	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
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
							{t("Login.back-to-home")}
						</Button>
					</Link>
				</div>

				<Card className="border-0 shadow-xl">
					<CardHeader className="space-y-1 pb-2">
						<div className="mb-1 flex justify-center">
							<div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl">
								<Lock className="h-6 w-6 text-white" />
							</div>
						</div>
						<CardTitle className="text-center text-2xl font-bold text-gray-900">
							{t("Register.title")}
						</CardTitle>
						<CardDescription className="text-center text-gray-600">
							{t("Register.subtitle")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Register Form */}
						<RegisterFormContainer>
							<RegisterForm />
						</RegisterFormContainer>
						<div className="text-center">
							<p className="text-sm text-gray-600">
								{t("Register.login-q")}{" "}
								<Link
									href="/auth/login"
									className="font-medium text-blue-600 hover:text-blue-800"
								>
									{t("Register.login")}
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center text-xs text-gray-500">
					<p>{t("Register.footer")}</p>
				</div>
			</div>
		</div>
	)
}
