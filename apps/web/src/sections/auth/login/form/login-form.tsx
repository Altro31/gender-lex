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
import { useTranslations } from "next-intl"

export default function LoginForm() {
	const t = useTranslations()
	return (
		<>
			<FormField
				name="email"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>{t("Commons.email")} *</FormLabel>
						<FormControl>
							<Input
								placeholder={t("Commons.email-placeholder")}
								type={"email"}
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
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>{t("Commons.password")} *</FormLabel>
						<FormControl>
							<Input
								placeholder={t("Commons.password-placeholder")}
								type={"password"}
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
			<div className="flex items-center justify-between">
				<FormField
					name="rememberMe"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center space-y-0 rounded-md">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>
									{t("Commons.remember-me")}
								</FormLabel>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>
			</div>
		</>
	)
}
