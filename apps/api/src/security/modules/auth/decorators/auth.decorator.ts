import { AuthGuard } from '@mguay/nestjs-better-auth'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

export function Auth() {
	return applyDecorators(UseGuards(AuthGuard), ApiUnauthorizedResponse())
}
