import { Injectable, Logger, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@repo/db/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	private readonly logger = new Logger(PrismaService.name)

	constructor() {
		super()
		const instance = this.$extends({})
		return instance as typeof instance & PrismaService
	}

	async onModuleInit() {
		try {
			await this.$connect()
			this.logger.log('Connection stablished successfully')
		} catch {
			this.logger.warn('Cannot connect to the database')
		}
	}
}
