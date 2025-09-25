import z from "zod"

export type Pagiantion = z.infer<typeof paginationSchema>
export const paginationSchema = z.object({
    page: z.coerce.number().int().default(1).optional(),
    pageSize: z.coerce.number().int().default(10).optional(),
})
