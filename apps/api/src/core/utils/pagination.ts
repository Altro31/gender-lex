export function buildPaginatedResponse(total: number, params?: any) {
	const skip = Number(params.skip ?? 0)
	const take = Number(params.take ?? 10)
	const page = skip / take + 1
	const totalPages = Math.ceil(total / take)
	return {
		page,
		pageSize: take,
		totalPages,
		total,
		hasNext: page < totalPages,
		hasPrevious: page > 1,
	}
}
