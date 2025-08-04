import { AnalysisCreateSchema } from '@repo/db/zod'
import { createZodDto } from 'nestjs-zod'

export class CreateAnalysisDto extends createZodDto(
	AnalysisCreateSchema.omit({ createdAt: true, id: true }),
) {}
