import { AuthService } from '@mguay/nestjs-better-auth'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { enhance } from '@repo/db'
import RESTHandler from '@zenstackhq/server/api/rest'
import { ZenStackMiddleware } from '@zenstackhq/server/express'
import { Request, Response } from 'express'
import type { EnvTypes } from 'src/app.module'
import { PrismaService } from 'src/core/modules/prisma/prisma.service'
import { getEncryptionKey } from 'src/core/utils/auth'

@Injectable()
export class CrudMiddleware implements NestMiddleware {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly config: ConfigService<EnvTypes>,
		private readonly authService: AuthService,
	) {}

	async use(req: Request, _res: Response, next: (error?: any) => void) {
		// base url for RESTful resource linkage
		const baseUrl = `${req.protocol}://${req.headers.host}${req.baseUrl}`
		const session = await this.authService.api.getSession({
			headers: req.headers as any,
		})
		const key = this.config.getOrThrow('ENCRYPTION_KEY')

		// construct an Express middleware and forward the request/response
		const inner = ZenStackMiddleware({
			// get an enhanced PrismaClient for the current user
			getPrisma: () => {
				return enhance(
					this.prismaService.prisma,
					{ user: session?.user },
					{ encryption: { encryptionKey: getEncryptionKey(key) } },
				)
			},
			// use RESTful style API
			handler: RESTHandler({ endpoint: baseUrl }),
		})
		inner(req, _res, next)
	}
}
