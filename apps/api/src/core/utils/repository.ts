import { Inject, type OnModuleInit } from '@nestjs/common'
import {
	Analysis,
	Model,
	Preset,
	Session,
	Account,
	Verification,
	Prisma,
	PrismaClient,
	User,
} from '@repo/db/models'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'
import { buildPaginatedResponse } from 'src/core/utils/pagination'
type ModelMap = {
	user: User
	analysis: Analysis
	model: Model
	preset: Preset
	session: Session
	account: Account
	verification: Verification
}

abstract class DynamicRepository<
	T extends Lowercase<Exclude<Prisma.ModelName, 'PresetModel'>>,
	Model = ModelMap[T],
> implements OnModuleInit
{
	model: PrismaClient[T]
	constructor(@Inject(ENHANCED_PRISMA) readonly prisma: PrismaClient) {}

	onModuleInit() {
		this.model = this.prisma[(<any>this.constructor).model]
	}

	async findAll(params?: any) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const [data, count] = await Promise.all([
			// @ts-expect-error aaaaaaaaaaa
			this.model.findMany({ ...params }),
			// @ts-expect-error aaaaaaaaaaa
			this.model.count({ where: params.where as object }),
		])

		const pagination = buildPaginatedResponse(count, params)
		return { data: data as Model[], ...pagination }
	}
	findOneBy<T extends keyof Model>(
		field: T,
		value: Model[T],
	): Promise<Model | null> {
		// @ts-expect-error aaaaaaaaaaa
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return this.model.findFirst({ where: { [field]: value } })
	}
	remove(id: string): Promise<Model> {
		// @ts-expect-error aaaaaaaaaaa
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return this.model.delete({ where: { id } })
	}
}

export function BaseRepository<
	T extends Lowercase<Exclude<Prisma.ModelName, 'PresetModel'>>,
>(model: T) {
	const Class = class extends DynamicRepository<T> {}
	Object.assign(Class, { model })
	return Class
}
