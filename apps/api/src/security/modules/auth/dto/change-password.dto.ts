import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const ChangePassword = z.object({
	prev_password: z.string().min(1),
	new_password: z.string().min(1),
})

export class ChangePasswordDto extends createZodDto(ChangePassword) {}
