import {
	Injectable,
	UnauthorizedException,
	type ExecutionContext,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export function JWTAuthGuard(throwError: boolean = true) {
	@Injectable()
	class JWTAuthGuard extends AuthGuard('jwt') {
		handleRequest<TUser = any>(
			_err: any,
			user: TUser | null,
			_info: any,
			_context: ExecutionContext,
			_status?: any,
		) {
			if (throwError && !user) throw new UnauthorizedException()
			return user
		}
	}

	return JWTAuthGuard
}
