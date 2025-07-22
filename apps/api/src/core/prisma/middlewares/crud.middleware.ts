import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { enhance } from '@repo/db'
import type { Role } from '@repo/db/models'
import RESTHandler from '@zenstackhq/server/api/rest'
import { ZenStackMiddleware } from '@zenstackhq/server/express'
import { Request, Response } from 'express'
import type { EnvTypes } from 'src/app.module'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { getEncryptionKey } from 'src/core/utils/auth'

@Injectable()
export class CrudMiddleware implements NestMiddleware {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly config: ConfigService<EnvTypes>,
	) {}

	use(req: Request, _res: Response, next: (error?: any) => void) {
		// base url for RESTful resource linkage
		const baseUrl = `${req.protocol}://${req.headers.host}${req.baseUrl}`

		console.log(req.user)
		const key = this.config.getOrThrow<string>('AUTH_SECRET')

		// get the current user from request
		const userId = req.headers['x-user-id']
		const userRole = req.headers['x-user-role'] ?? 'USER'
		const user = userId
			? { id: userId as string, role: userRole as Role }
			: undefined

		// construct an Express middleware and forward the request/response
		const inner = ZenStackMiddleware({
			// get an enhanced PrismaClient for the current user
			getPrisma: () =>
				enhance(
					this.prismaService,
					{ user },
					{ encryption: { encryptionKey: getEncryptionKey(key) } },
				),
			// use RESTful style API
			handler: RESTHandler({ endpoint: baseUrl }),
		})
		inner(req, _res, next)
	}
}
