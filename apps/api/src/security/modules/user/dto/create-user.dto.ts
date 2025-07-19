import type { $Enums } from '@repo/db/models'
import { Exclude } from 'class-transformer'
import { IsEmail, IsOptional, IsStrongPassword } from 'class-validator'

export class CreateUserDto {
	@IsEmail()
	email: string

	@IsOptional()
	@IsStrongPassword()
	password?: string

	@Exclude()
	provider?: $Enums.AuthProvider
}
