import { AuthService } from '@mguay/nestjs-better-auth'
import { Controller } from '@nestjs/common'
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
}
