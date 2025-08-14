import { Injectable } from '@nestjs/common'
import type { Prisma } from '@repo/db/models'
import Repository from 'src/core/utils/repository'

@Injectable()
class AnalysisRepositoryClass extends Repository.base('analysis') {}
export type AnalysisRepository = Prisma.AnalysisDelegate
export const AnalysisRepository = AnalysisRepositoryClass
