import { $Enums, type Model, type Preset } from "@repo/db/models"
import { z } from "zod/mini"

export type PresetSchema = z.infer<typeof PresetSchema>
export const PresetSchema = z.object({
	name: z.string().check(z.minLength(1, "Name field is required")),
	description: z.string(),
	Models: z.array(
		z.object({
			id: z.optional(z.string()),
			role: z.enum($Enums.ModelRole, "Role field is required"),
			Model: z.object(
				{
					id: z.string(),
				},
				"Model field is required",
			) as z.ZodMiniType<Partial<Model>>,
		}),
	),
}) satisfies z.ZodMiniType<Partial<Preset>>
