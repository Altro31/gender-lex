import type {
	PrismaClient,
	Analysis,
	User,
	Model,
	Preset,
	Prisma,
} from '@repo/db/models'
import { buildPaginatedResponse } from 'src/core/utils/pagination'

type ModelMap = { user: User; analysis: Analysis; model: Model; preset: Preset }

export function BaseRepository<T extends Lowercase<Prisma.ModelName>>(
	model: T,
) {
	type Model = ModelMap[T]
	return class BaseRepository {
		prisma: PrismaClient

		async findAll(params?: any) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const [data, count] = await Promise.all([
				// @ts-expect-error aaaaaaaaaaa
				this.prisma[model].findMany({ ...params }),
				// @ts-expect-error aaaaaaaaaaa
				this.prisma[model].count({ where: params.where as object }),
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
			return this.prisma[model].findFirst({ where: { [field]: value } })
		}
		remove(id: string): Promise<Model> {
			// @ts-expect-error aaaaaaaaaaa
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return this.prisma[model].delete({ where: { id } })
		}
	}
}
