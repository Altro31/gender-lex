import { Inject, type Provider, type Type } from '@nestjs/common'
import { Prisma, PrismaClient } from '@repo/db/models'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'

type CamelCase<S extends string> = S extends `${infer P1}${infer P2}`
	? `${Lowercase<P1>}${P2}`
	: Lowercase<S>

type ModelName = CamelCase<Prisma.ModelName>
class BaseRepository {
	constructor(@Inject(ENHANCED_PRISMA) prisma: PrismaClient) {
		// @ts-expect-error aaaaaaaaaaaaaaaaaaa
		const model = this.model as ModelName

		Object.assign(this, prisma[model])
	}
}

function base(model: ModelName) {
	const classRef = BaseRepository
	Object.assign(classRef.prototype, { model })
	return classRef
}

function register(repository: Type<BaseRepository>): Provider {
	return { provide: repository, useClass: repository }
}

const Repository = { base, register }
export default Repository
