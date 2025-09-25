import z from "zod"

export type Pagiantion = z.infer<typeof paginationSchema>
export const paginationSchema = z.object({
    page: z.int().default(1).optional(),
    pageSize: z.int().default(10).optional(),
})
