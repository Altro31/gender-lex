"use client"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { RegisterSchema } from "@/sections/auth/register/form/register-schema"
import { signUp } from "@/services/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface Props {
	children: React.ReactNode
}

export default function RegisterFormContainer({ children }: Props) {
	const router = useRouter()
	const form = useForm({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			acceptTerms: false,
		},
	})
	const { status, execute } = useAction(signUp, {
		onSuccess: () => {
			toast.success("User registered successfully")
			router.replace("/")
			console.log("navigating...")
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
							Creando cuenta...
						</div>
					) : (
						"Crear Cuenta"
					)}
				</Button>
			</form>
		</Form>
	)
}
