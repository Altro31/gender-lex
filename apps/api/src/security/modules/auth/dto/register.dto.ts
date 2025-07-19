import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const Register = z.object({
	email: z.string().email(),
	password: z.string().min(1),
})

export class RegisterDto extends createZodDto(Register) {}
