import {
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	Post,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger'
import type { IncomingHttpHeaders } from 'http'
import { extractBearer } from 'src/core/utils/auth'
import { AuthService } from './auth.service'
import { ChangePasswordDto } from './dto/change-password.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserWithoutPassword } from './entities/user_without_password.entity'
import { JWTAuthGuard } from './guards/jwt_auth.guard'
import { LocalAuthGuard } from './guards/local_auth.guard'
import { CurrentUser } from './param_decorators/current_user.param_decorator'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * Login with email and password
	 */
	@ApiBody({ type: LoginDto })
	@UseGuards(LocalAuthGuard)
	@HttpCode(200)
	@Post('login')
	login(@CurrentUser() user: UserWithoutPassword) {
		return { token: this.authService.generateToken(user), user }
	}

	/**
	 * Register with email, username and password
	 */
	@HttpCode(200)
	@Post('register')
	async register(@Body() data: RegisterDto) {
		return { token: await this.authService.register(data) }
	}

	@ApiBearerAuth()
	@UseGuards(JWTAuthGuard())
	@HttpCode(200)
	@Get('verify')
	verify(@CurrentUser() user: UserWithoutPassword) {
		return { user }
	}

	/**
	 * Change password
	 */
	@ApiBearerAuth()
	@UseGuards(JWTAuthGuard())
	@HttpCode(200)
	@Post('change-password')
	async change_password(
		@CurrentUser() user: UserWithoutPassword,
		@Body() data: ChangePasswordDto,
	) {
		return {
			user: await this.authService.change_password(
				user.id,
				data.prev_password,
				data.new_password,
			),
		}
	}

	/**
	 * Login with Google
	 */
	@ApiBearerAuth()
	@HttpCode(200)
	@Post('google/callback')
	async googleCallback(@Headers() headers: IncomingHttpHeaders) {
		const token = extractBearer(headers.authorization ?? '')
		if (!token) {
			throw new UnauthorizedException()
		}
		try {
			return await this.authService.loginGoogle(token)
		} catch {
			throw new UnauthorizedException()
		}
	}
}
