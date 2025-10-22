"use client"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { LoginSchema } from "@/sections/auth/login/form/login-schema"
import { signInEmail } from "@/services/auth"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "@/locales/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface Props {
	children: React.ReactNode
}

export default function LoginFormContainer({ children }: Props) {
	const t = useTranslations()
	const router = useRouter()
	const form = useForm({
		resolver: standardSchemaResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	})
	const { status, execute } = useAction(signInEmail, {
		onSuccess: ({ data }) => {
			console.log(data)

			toast.success(t("Login.form.on-success"))
			router.replace("/")
		},
		onError: ({ error }) => {
			toast.error(error.serverError?.message)
		},
	})
	const isPending = status === "executing"
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(execute)} className="space-y-4">
				{children}
				<Button
					variant="default"
					type="submit"
					disabled={isPending}
					className="w-full"
				>
					{isPending ? (
						<div className="flex items-center gap-2">
							<Loader2 className="animate-spin" />
							{t("Actions.doSignIn")}
						</div>
					) : (
						t("Actions.signIn")
					)}
				</Button>
			</form>
		</Form>
	)
}
