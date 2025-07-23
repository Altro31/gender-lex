import {
	Module,
	type MiddlewareConsumer,
	type NestModule
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ApiHandlerService } from '@zenstackhq/server/nestjs'
import { ZodValidationPipe } from 'nestjs-zod'
import * as path from 'path'
import { ModelModule } from 'src/ai/modules/model/model.module'
import { CrudMiddleware } from 'src/core/prisma/middlewares/crud.middleware'
import { PrismaModule } from 'src/core/prisma/prisma.module'
import { PrismaService } from 'src/core/prisma/prisma.service'
import z from 'zod'
import { AiModule } from './ai/modules/ai/ai.module'
import { ExtractorModule } from './ai/modules/extractor/extractor.module'
import { PresetModule } from './ai/modules/preset/preset.module'
import { AuthModule } from './security/modules/auth/auth.module'
import { UserModule } from './security/modules/user/user.module'

export type EnvTypes = z.infer<typeof EnvTypes>
const EnvTypes = z.object({
	PORT: z.coerce.number().int().min(0).default(4000),
	DATABASE_URL: z.string().url(),
	GROQ_API_KEY: z.string(),
	PDF_SERVICES_CLIENT_ID: z.string(),
	PDF_SERVICES_CLIENT_SECRET: z.string(),
	AUTH_SECRET: z.string().min(32),
	AUTH_GOOGLE_ID: z.string(),
	AUTH_GOOGLE_SECRET: z.string(),
	HOST_URL: z.string().url(),
})


@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: config => EnvTypes.parse(config),
		}),
		PrismaModule,
		ExtractorModule,
		AiModule,
		AuthModule,
		UserModule,
		ModelModule,
		ServeStaticModule.forRoot({
			rootPath: path.join(process.cwd(), 'public'),
		}),
		PresetModule,
	],
	providers: [
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
		PrismaService,
		ApiHandlerService,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CrudMiddleware).forRoutes('/zen')
	}
}
