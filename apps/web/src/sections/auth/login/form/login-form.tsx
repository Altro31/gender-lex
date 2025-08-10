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
import Link from "next/link"

export default function LoginForm() {
	return (
		<>
			<FormField
				name="email"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Correo electónico *</FormLabel>
						<FormControl>
							<Input
								placeholder="tu@ejemplo.com"
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
						<FormLabel>Contraseña *</FormLabel>
						<FormControl>
							<Input
								placeholder="Tu contraseña"
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
								<FormLabel>Recordarme</FormLabel>

								<FormMessage />
							</div>
						</FormItem>
					)}
				/>
				<Link
					href="/auth/forgot-password"
					className="text-sm text-blue-600 hover:text-blue-800"
				>
					¿Olvidaste tu contraseña?
				</Link>
			</div>
		</>
	)
}
