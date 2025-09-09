import { z } from "zod/mini"

export type HomeSchema = z.infer<typeof HomeSchema>
export const HomeSchema = z
	.object({
		files: z.array(
			z.object({
				file: z.file(),
			}),
		),
		text: z.string(),
		preset: z.object({
			id: z.string(),
		}),
	})
	.check(
		z.superRefine(({ files, text }, ctx) => {
			if (!(files.length || text)) {
				ctx.addIssue({
					code: "custom",
					path: ["files"],
				})
			}
		}),
	)
