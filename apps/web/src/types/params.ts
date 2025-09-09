export type SelectResult<T> = {
	data: T
	page: number
	pageSize: number
	totalPages: number
	hasNextPage: number
}
