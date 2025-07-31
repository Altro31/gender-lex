import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, type OpenAPIObject } from '@nestjs/swagger'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { patchNestJsSwagger } from 'nestjs-zod'
import * as path from 'path'
import { generateDocs } from 'src/core/utils/docs'
import { GlobalJWTAuthGuard } from 'src/security/modules/auth/guards/global-jwt-auth.guard'
import { AppModule, type EnvTypes } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		cors: true,
		rawBody: true,
	})

	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.useGlobalGuards(new (GlobalJWTAuthGuard())())
	app.useBodyParser('text')
	await generateDocs(app)
	openapi(app)

	const port = app.get(ConfigService<EnvTypes>).get<number>('PORT') ?? 4000
	await app.listen(port)
	const url = await app.getUrl()
	console.log(`	🚀Server running at ${url}`)
	console.log(`	Docs running at ${url}/api`)
}

function openapi(app: INestApplication) {
	let doc: OpenAPIObject | undefined
	try {
		doc = yaml.load(
			fs.readFileSync(
				path.join(process.cwd(), './public/openapi.yaml'),
				'utf8',
			),
		) as OpenAPIObject
	} catch (e) {
		console.log(e)
	}
	if (!doc) return console.warn('OpenApi spec cannot be loaded')
	SwaggerModule.setup('api', app, doc)
}

patchNestJsSwagger()
void bootstrap()
