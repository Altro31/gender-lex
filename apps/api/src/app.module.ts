import {
	Module,
	type MiddlewareConsumer,
	type NestModule,
} from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ApiHandlerService } from '@zenstackhq/server/nestjs'
import { ClsModule } from 'nestjs-cls'

import * as path from 'path'
import { AppController } from 'src/app.controller'
import { AnalysisModule } from 'src/app/modules/analysis/analysis.module'
import { BiasDetectionModule } from 'src/app/modules/bias-detection/bias-detection.module'
import { ModelModule } from 'src/app/modules/model/model.module'
import { CrudMiddleware } from 'src/core/modules/prisma/middlewares/crud.middleware'
import { PrismaModule } from 'src/core/modules/prisma/prisma.module'
import { PrismaService } from 'src/core/modules/prisma/prisma.service'
import { SseModule } from 'src/core/modules/sse/sse.module'
import z from 'zod'
import { AiModule } from './app/modules/ai/ai.module'
import { ExtractorModule } from './app/modules/extractor/extractor.module'
import { PresetModule } from './app/modules/preset/preset.module'
import { AuthModule } from './security/modules/auth/auth.module'
import { UserModule } from './security/modules/user/user.module'

export type EnvTypes = z.infer<typeof EnvTypes>
const EnvTypes = z.object({
	PORT: z.coerce.number().int().min(0).default(4000),
	GROQ_API_KEY: z.string(),
	PDF_SERVICES_CLIENT_ID: z.string(),
	PDF_SERVICES_CLIENT_SECRET: z.string(),
	BETTER_AUTH_SECRET: z.string().min(32),
	BETTER_AUTH_URL: z.string().url(),
	UI_URL: z.string().url(),
	AUTH_GOOGLE_ID: z.string(),
	AUTH_GOOGLE_SECRET: z.string(),
	AUTH_GITHUB_ID: z.string(),
	AUTH_GITHUB_SECRET: z.string(),
	ENCRYPTION_KEY: z.string().base64(),
})

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: config => EnvTypes.parse(config),
		}),
		ClsModule.forRoot({ global: true, middleware: { mount: true } }),
		PrismaModule,
		ExtractorModule,
		AnalysisModule,
		AiModule,
		AuthModule,
		UserModule,
		ModelModule,
		ServeStaticModule.forRoot({
			rootPath: path.join(process.cwd(), 'public'),
		}),
		JwtModule.registerAsync({
			global: true,
			inject: [ConfigService],
			useFactory(config: ConfigService<EnvTypes>) {
				return {
					secret: config.get('BETTER_AUTH_SECRET'),
					signOptions: { expiresIn: '1d' },
				}
			},
		}),
		PresetModule,
		SseModule,
		BiasDetectionModule,
	],
	providers: [PrismaService, ApiHandlerService],
	controllers: [AppController],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CrudMiddleware).forRoutes('/zen')
	}
}
