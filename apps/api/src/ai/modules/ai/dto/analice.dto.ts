import { ApiProperty } from '@nestjs/swagger'



export class AnaliceDTO  {

	@ApiProperty({ type: 'string', format: 'binary', required: false })
	file?: string

	text?: string
}
