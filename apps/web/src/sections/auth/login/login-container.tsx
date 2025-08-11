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
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function LoginContainer() {
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
							{t("Login.title")}
						</CardTitle>
						<CardDescription className="text-center text-gray-600">
							{t("Login.subtitle")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Social Login Buttons */}
						<div className="space-y-3">
							<Button
								variant="outline"
								className="h-11 w-full gap-3 bg-transparent hover:bg-gray-50"
								onClick={async () => {
									"use server"
									await signInSocial("google")
								}}
							>
								<SiGoogle className="size-5" />
								{t("Login.socials.google")}
							</Button>
							<Button
								variant="outline"
								className="h-11 w-full gap-3 bg-transparent hover:bg-gray-50"
								onClick={async () => {
									"use server"
									await signInSocial("github")
								}}
							>
								<SiGithub className="size-5" />
								{t("Login.socials.github")}
							</Button>
						</div>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-gray-500">
									{t("Login.continue-with-email")}
								</span>
							</div>
						</div>

						{/* Login Form */}
						<LoginFormContainer>
							<LoginForm />
						</LoginFormContainer>
						<div className="text-center">
							<p className="text-sm text-gray-600">
								{t("Login.register-quest")}{" "}
								<Link
									href="/auth/register"
									className="font-medium text-blue-600 hover:text-blue-800"
								>
									{t("Login.register")}
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center text-xs text-gray-500">
					<p>
						{t("Security.accept-temrs.1")}{" "}
						<Link
							href="/terms"
							className="text-blue-600 hover:text-blue-800"
						>
							{t("Security.accept-temrs.terms")}
						</Link>{" "}
						{t('Security.accept-temrs.2')}{" "}
						<Link
							href="/privacy"
							className="text-blue-600 hover:text-blue-800"
						>
							{t("Security.accept-temrs.policy")}
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
