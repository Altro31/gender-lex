import { AuthService } from '@mguay/nestjs-better-auth'
import {
	Injectable,
	type CanActivate,
	type ExecutionContext,
} from '@nestjs/common'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class GlobalAuthGuard implements CanActivate {
	constructor(
		private readonly clsService: ClsService,
		private readonly authService: AuthService,
	) {}

	async canActivate(context: ExecutionContext) {
		const request: Request = context.switchToHttp().getRequest()
		const session = await this.authService.api.getSession({
			headers: request.headers,
		})
		this.clsService.set('session', session?.session)
		this.clsService.set('user', session?.user)
		return true
	}
}
