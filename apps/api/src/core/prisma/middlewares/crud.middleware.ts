import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { enhance } from '@repo/db'
import type { PrismaClient } from '@repo/db/models'
import RESTHandler from '@zenstackhq/server/api/rest'
import { ZenStackMiddleware } from '@zenstackhq/server/express'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'
import { Request, Response } from 'express'
import { ClsService } from 'nestjs-cls'
import type { EnvTypes } from 'src/app.module'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { getEncryptionKey } from 'src/core/utils/auth'

@Injectable()
export class CrudMiddleware implements NestMiddleware {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly config: ConfigService<EnvTypes>,
		private readonly cls: ClsService,
		private readonly jwtService: JwtService,
		@Inject(ENHANCED_PRISMA) private readonly prisma: PrismaClient,
	) {}

	use(req: Request, _res: Response, next: (error?: any) => void) {
		// base url for RESTful resource linkage
		const baseUrl = `${req.protocol}://${req.headers.host}${req.baseUrl}`

		const key = this.config.getOrThrow<string>('AUTH_SECRET')
		const bearerToken = req.headers.authorization ?? ''
		const token = bearerToken.slice(7)
		const payload = token && this.jwtService.verify(token, { secret: key }) 
		const user = payload ? { id: payload.sub, ...payload } : undefined

		// construct an Express middleware and forward the request/response
		const inner = ZenStackMiddleware({
			// get an enhanced PrismaClient for the current user
			getPrisma: () => {
				return enhance(
					this.prismaService,
					{ user },
					{ encryption: { encryptionKey: getEncryptionKey(key) } },
				)
			},
			// use RESTful style API
			handler: RESTHandler({ endpoint: baseUrl }),
		})
		inner(req, _res, next)
	}
}
