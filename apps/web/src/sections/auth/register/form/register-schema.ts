import { z } from "zod/mini"

const PasswordSchema = z
	.string()
	.check(
		z.minLength(8, "La contraseña debe tener al menos 8 caracteres"),
		z.regex(
			/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"La contraseña debe contener al menos una mayúscula, una minúscula y un número",
		),
	)

export const RegisterSchema = z
	.object({
		name: z
			.string()
			.check(
				z.minLength(2, "El nombre debe contener al menos 2 caracteres"),
			),
		email: z.email("El correo electrónico es requerido"),
		password: PasswordSchema,
		confirmPassword: z.string(),
		acceptTerms: z.boolean(),
	})
	.check(
		z.superRefine(({ confirmPassword, password, acceptTerms }, ctx) => {
			if (password !== confirmPassword) {
				ctx.addIssue({
					code: "custom",
					message: "Las contraseñas no coinciden",
					path: ["confirmPassword"],
				})
			}
			if (!acceptTerms) {
				ctx.addIssue({
					code: "custom",
					message: "Debe aceptar los términos y condiciones",
					path: ["acceptTerms"],
				})
			}
		}),
	)
