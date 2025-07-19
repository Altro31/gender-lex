import {
	Injectable,
	type CallHandler,
	type ExecutionContext,
	type NestInterceptor,
} from '@nestjs/common'
import type { Request } from 'express'
import type { ClsService } from 'nestjs-cls'
import type { Observable } from 'rxjs'
import type { UserWithoutPassword } from 'src/security/modules/auth/entities/user_without_password.entity'

@Injectable()
export class UserInterceptor implements NestInterceptor {
	constructor(private readonly cls: ClsService) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const req: Request = context.switchToHttp().getRequest()
		const user = req.user as UserWithoutPassword
		this.cls.set('auth', user ? { id: user.id } : undefined)
		return next.handle()
	}
}
