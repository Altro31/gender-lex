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

export default function RegisterForm() {
	return (
		<>
			<FormField
				name="name"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Nombre *</FormLabel>
						<FormControl>
							<Input
								placeholder="Tu nombre"
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
						<FormLabel>Correo electónico *</FormLabel>
						<FormControl>
							<Input
								placeholder="tu@ejemplo.com"
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
							<FormLabel>Contraseña *</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Crea una contraseña segura"
									type="password"
								/>
							</FormControl>
							{field.value && (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<div className="flex-1 bg-gray-200 rounded-full h-2">
											<div
												className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
												style={{
													width: `${(passwordStrength / 5) * 100}%`,
												}}
											/>
										</div>
										<span className="text-xs text-gray-600">
											{getStrengthText(passwordStrength)}
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
						<FormLabel>Confirmar contraseña *</FormLabel>
						<FormControl>
							<Input
								{...field}
								placeholder="Confirma tu contraseña"
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
						<div className="flex flex-row items-center space-y-0 gap-1 rounded-md">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className="*:contents">
								Acepto los{" "}
								<Link
									href="/terms"
									className="text-blue-600 hover:text-blue-800 "
								>
									Términos de Servicio
								</Link>{" "}
								y la{" "}
								<Link
									href="/privacy"
									className="text-blue-600 hover:text-blue-800"
								>
									Política de Privacidad
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

const getStrengthText = (strength: number) => {
	if (strength <= 2) return "Débil"
	if (strength <= 3) return "Media"
	return "Fuerte"
}
