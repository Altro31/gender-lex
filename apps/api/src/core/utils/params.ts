import {
	applyDecorators,
	createParamDecorator,
	type ExecutionContext,
} from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'
import type { Request } from 'express'
import { QueryParams } from 'src/core/types/query'

export function ApiRequestParams() {
	return applyDecorators(
		ApiQuery({ name: 'page', type: Number, default: 1 }),
		ApiQuery({ name: 'pageSize', type: Number, default: 10 }),
		ApiQuery({ name: 'query', type: String, required: false }),
		ApiQuery({ name: 'filters', type: String, required: false }),
		ApiQuery({ name: 'sorts', type: String, required: false }),
	)
}

export type RequestParams = ReturnType<typeof requestParamsFactory>
const requestParamsFactory = (_: any, ctx: ExecutionContext) => {
	const req: Request = ctx.switchToHttp().getRequest()
	const query = QueryParams.parse(req.query)

	const pagination = buildPagination(query)
	const filters = buildFilters(query)
	const sorts = buildSorts(query)
	return { ...pagination, ...filters, ...sorts }
}

/**
 * Filters example: filters=name:
 * Sorts example: sorts=name,-age,Role.name,-Analysis.id //Use `-` for DESC ordering
 */
export const RequestParams = createParamDecorator(requestParamsFactory)

export function buildPagination(query: QueryParams) {
	const page = query.page ?? 1
	const pageSize = query.pageSize ?? 10
	return { skip: (page - 1) * pageSize, take: pageSize }
}

export function buildFilters(query: QueryParams) {
	const filters = query.filters
	if (filters) {
		let whereMap = {}
		for (const [key, value] of Object.entries(filters)) {
			const keyMap = key.split('.')
			const whereFilter = keyMap.reduceRight(
				(acc, key) => Object.fromEntries([[key, acc]]),
				{ contains: value } as unknown as Record<string, object>,
			)
			whereMap = { ...whereMap, ...whereFilter }
		}
		return { where: whereMap }
	}
}

export function buildSorts(query: QueryParams) {
	const sorts = query.sorts
	if (sorts) {
		let sortMap = {}
		for (const sortQuery of sorts.split(',')) {
			const isDESC = sortQuery.startsWith('-')
			const value = isDESC ? 'desc' : 'asc'
			const key = sortQuery.slice(Number(isDESC))
			const keyMap = key.split('.')
			const sortFilter = keyMap.reduceRight(
				(acc, key) => Object.fromEntries([[key, acc]]),
				{ contains: value } as unknown as Record<string, object>,
			)
			sortMap = { ...sortMap, ...sortFilter }
		}
		return { orderBy: sortMap }
	}
}
