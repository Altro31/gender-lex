import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import {
	DocumentBuilder,
	SwaggerModule,
	type OpenAPIObject,
} from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'
import { GlobalJWTAuthGuard } from 'src/security/modules/auth/guards/global-jwt-auth.guard'
import { AppModule, type EnvTypes } from './app.module'
import * as yaml from 'js-yaml'
import * as fs from 'fs'
import * as path from 'path'
import { isErrorResult, merge } from 'openapi-merge'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		cors: true,
		rawBody: true,
	})

	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.useGlobalGuards(new (GlobalJWTAuthGuard())())
	app.useBodyParser('text')

	openapi(app)

	const port = app.get(ConfigService<EnvTypes>).get<number>('PORT') ?? 4000
	await app.listen(port)
	const url = await app.getUrl()
	console.log(`	🚀Server running at ${url}`)
	console.log(`	Docs running at ${url}/api`)
}

function openapi(app: INestApplication) {
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Gender Lex Backend')
		.setVersion('1.0')
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config)
	let doc: OpenAPIObject | undefined
	try {
		doc = yaml.load(
			fs.readFileSync(
				path.join(process.cwd(), './public/zen/openapi.yaml'),
				'utf8',
			),
		) as OpenAPIObject
	} catch (e) {
		console.log(e)
	}
	const result = merge([
		{ oas: documentFactory() as any },
		...(doc ? [{ oas: doc as any }] : []),
	])
	const document = isErrorResult(result) ? documentFactory() : result.output

	SwaggerModule.setup('api', app, document as OpenAPIObject)
}

patchNestJsSwagger()
void bootstrap()
