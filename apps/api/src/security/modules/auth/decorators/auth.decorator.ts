import { AuthGuard } from '@mguay/nestjs-better-auth'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger'

export function Auth() {
	return applyDecorators(
		ApiSecurity('better-auth.session'),
		UseGuards(AuthGuard),
		ApiUnauthorizedResponse(),
	)
}
