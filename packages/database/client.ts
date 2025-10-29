import { Prisma } from './prisma/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

export { PrismaClient } from './prisma/generated/client/client'

export const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
})

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
