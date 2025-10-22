"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTranslations, type MarkupTagsFunction } from "next-intl"
import { Link } from "@/locales/navigation"

export default function RegisterForm() {
	const t = useTranslations()

	return (
		<>
			<FormField
				name="name"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>{t("Commons.name")} *</FormLabel>
						<FormControl>
							<Input
								placeholder={t("Commons.name-placeholder")}
								type={"text"}
								value={field.value}
								onChange={(e) => {
									const val = e.target.value
									field.onChange(val)
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				name="email"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>{t("Commons.email")} *</FormLabel>
						<FormControl>
							<Input
								placeholder={t("Commons.email-placeholder")}
								type={""}
								value={field.value}
								onChange={(e) => {
									const val = e.target.value
									field.onChange(val)
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				name="password"
				render={({ field }) => {
					const passwordStrength = getPasswordStrength(field.value)

					return (
						<FormItem className="w-full">
							<FormLabel>{t("Commons.password")} *</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder={t(
										"Commons.password-placeholder",
									)}
									type="password"
								/>
							</FormControl>
							{field.value && (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<div className="h-2 flex-1 rounded-full bg-gray-200">
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
												t,
											)}
										</span>
									</div>
								</div>
							)}
							<FormMessage />
						</FormItem>
					)
				}}
			/>

			<FormField
				name="confirmPassword"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>
							{t("Register.form.confirm-password")} *
						</FormLabel>
						<FormControl>
							<Input
								{...field}
								placeholder={t(
									"Register.form.confirm-password-placeholder",
								)}
								type="password"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				name="acceptTerms"
				render={({ field }) => (
					<FormItem className="">
						<div className="flex flex-row items-center gap-1 space-y-0 rounded-md">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className="*:contents">
								{t("Security.accept-temrs.1")}{" "}
								<Link
									href="/terms"
									className="text-blue-600 hover:text-blue-800"
								>
									{t("Security.accept-temrs.terms")}
								</Link>{" "}
								{t("Security.accept-temrs.2")}{" "}
								<Link
									href="/privacy"
									className="text-blue-600 hover:text-blue-800"
								>
									{t("Security.accept-temrs.policy")}
								</Link>
							</FormLabel>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	)
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

const getStrengthColor = (strength: number) => {
	if (strength <= 2) return "bg-red-500"
	if (strength <= 3) return "bg-yellow-500"
	return "bg-green-500"
}

const getStrengthText = (strength: number, t: MarkupTagsFunction) => {
	if (strength <= 2) return t("Security.password.strength.weak")
	if (strength <= 3) return t("Security.password.strength.medium")
	return t("Security.password.strength.strong")
}
