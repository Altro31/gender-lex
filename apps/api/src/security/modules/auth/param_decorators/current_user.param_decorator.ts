import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { UserWithoutPassword } from 'src/security/modules/auth/entities/user_without_password.entity'

export const CurrentUser = createParamDecorator(
	(_, context: ExecutionContext) => {
		return context.switchToHttp().getRequest().user as UserWithoutPassword
	},
)
