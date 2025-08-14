import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class AnaliceDTO {
	@ApiProperty({ type: 'string', format: 'binary', required: false })
	@IsOptional()
	file?: string

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	text?: string
}
