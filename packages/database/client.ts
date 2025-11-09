import { Prisma } from './prisma/generated/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

export { Prisma } from './prisma/generated/client.ts'
export { PrismaClient } from './prisma/generated/client/client.ts'

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
