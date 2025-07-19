import Schemas from '@repo/db/zod'
import { createZodDto } from 'nestjs-zod'

export class CreateAnalysisDto extends createZodDto(
	Schemas.AnalysisCreateSchema.omit({ createdAt: true, id: true }),
) {}
