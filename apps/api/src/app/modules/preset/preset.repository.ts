import { Inject, Injectable } from '@nestjs/common'
import { PrismaClient, type Prisma } from '@repo/db/models'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'
import { PrismaRepository } from 'src/core/utils/repository'

@Injectable()
class PresetRepositoryClass extends PrismaRepository {
	constructor(@Inject(ENHANCED_PRISMA) prisma: PrismaClient) {
		super(prisma, 'preset')
	}
}
export const PresetRepository = PresetRepositoryClass
export type PresetRepository = Prisma.PresetDelegate
