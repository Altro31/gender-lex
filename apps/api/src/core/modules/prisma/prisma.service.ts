import { Injectable, Logger, type OnModuleInit } from '@nestjs/common'
import { extension, PrismaClient } from '@repo/db/client'

@Injectable()
export class PrismaService implements OnModuleInit {
	private readonly logger = new Logger(PrismaService.name)
	private readonly prisma$: PrismaClient

	constructor() {
		this.prisma$ = new PrismaClient()
	}

	async onModuleInit() {
		try {
			await this.prisma.$connect()
			this.logger.log('Connection stablished successfully')
		} catch {
			this.logger.warn('Cannot connect to the database')
		}
	}

	get prisma() {
		return this.prisma$.$extends(extension)
	}
}
