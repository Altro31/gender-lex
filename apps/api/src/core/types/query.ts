import z from 'zod'

export type PaginationParams = z.infer<typeof PaginationParams>
export const PaginationParams = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).default(10),
})

export type QueryParams = z.infer<typeof QueryParams>
export const QueryParams = PaginationParams.extend({
	query: z.string().optional(),
	filters: z.record(z.string(), z.string()).optional(),
	sorts: z.string().optional(),
})

export interface Paginated {
	page: number
	pageSize: number
	totalPages: number
	total: number
	hasNext: boolean
	hasPrevious: boolean
}
