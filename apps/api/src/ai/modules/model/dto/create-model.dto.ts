import Schemas from '@repo/db/zod'
import { createZodDto } from 'nestjs-zod'

export class CreateModelDTO extends createZodDto(
	Schemas.ModelCreateSchema.omit({ id: true }),
) {}
