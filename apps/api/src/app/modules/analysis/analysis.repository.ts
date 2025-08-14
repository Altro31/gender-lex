import { Injectable } from '@nestjs/common'
import type { Prisma } from '@repo/db/models'
import * as Repository from 'src/core/utils/repository'

@Injectable()
class AnalysisRepositoryClass extends Repository.base('analysis') {}
export type AnalysisRepository = Repository.type<Prisma.AnalysisDelegate>
export const AnalysisRepository = AnalysisRepositoryClass
