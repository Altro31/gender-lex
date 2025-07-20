import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export function GlobalJWTAuthGuard() {
	@Injectable()
	class JWTAuthGuard extends AuthGuard('jwt') {
		handleRequest<TUser = any>(_err: any, user: TUser | null) {
			return user
		}
	}

	return JWTAuthGuard
}
