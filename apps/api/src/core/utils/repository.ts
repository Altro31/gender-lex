import { Inject, type Provider, type Type } from '@nestjs/common'
import { Prisma, PrismaClient } from '@repo/db/models'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'

type CamelCase<S extends string> = S extends `${infer P1}${infer P2}`
	? `${Lowercase<P1>}${P2}`
	: Lowercase<S>

type ModelName = CamelCase<Prisma.ModelName>
class BaseRepository {
	prisma: any
	constructor(@Inject(ENHANCED_PRISMA) prisma: PrismaClient) {
		// @ts-expect-error this has meta.model attribute
		this.prisma = prisma[this.meta.model]
	}
}

export function base(model: ModelName) {
	const classRef = class extends BaseRepository {}
	Object.assign(classRef.prototype, { meta: { model } })
	return classRef
}

export function register(repository: Type<BaseRepository>): Provider {
	return { provide: repository, useClass: repository }
}

export type type<T> = { prisma: T }
