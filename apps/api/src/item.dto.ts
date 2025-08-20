import { ApiProperty } from '@nestjs/swagger'

export class Item {
	id: number

	@ApiProperty({ type: 'string', enum: ['pending', 'done'] })
	status: 'pending' | 'done'
}
