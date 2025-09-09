import { Prisma } from '@zenstackhq/runtime/models'
export { PrismaClient } from '@prisma/client'

export const extension = Prisma.defineExtension({
	query: {
		preset: {
			async findMany({ query, args }) {
				return query({
					...args,
					include: {
						Models: { include: { Model: true } },
						...args.include,
					},
				})
			},
		},
	},
})
