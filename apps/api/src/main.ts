import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule, type EnvTypes } from './app.module'
import { patchNestJsSwagger } from 'nestjs-zod'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		cors: true,
		rawBody: true,
	})

	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.useBodyParser('text')

	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Gender Lex Backend')
		.setVersion('1.0')
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config)
	patchNestJsSwagger()
	SwaggerModule.setup('api', app, documentFactory)
	const port = app.get(ConfigService<EnvTypes>).get<number>('PORT') ?? 4000
	await app.listen(port)
	console.log(`	🚀Server running at http://localhost:${port}`)
	console.log(`	Docs running at http://localhost:${port}/api`)
}
void bootstrap()
