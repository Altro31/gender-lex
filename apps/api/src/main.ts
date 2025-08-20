import { AuthService } from '@mguay/nestjs-better-auth'
import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { type OpenAPIObject } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import * as cors from 'cors'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { ClsService } from 'nestjs-cls'
import { patchNestJsSwagger } from 'nestjs-zod'
import * as path from 'path'
import { generateDocs } from 'src/core/utils/docs'
import { GlobalAuthGuard } from 'src/security/modules/auth/guards/global-auth.guard'
import { AppModule, type EnvTypes } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bodyParser: false,
	})

	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.useGlobalGuards(
		new GlobalAuthGuard(app.get(ClsService), app.get(AuthService)),
	)
	await generateDocs(app)
	openapi(app)

	const configService = app.get(ConfigService<EnvTypes>)
	const uiURL = configService.get<string>('UI_URL')
	app.use(cors({ origin: uiURL }))

	const port = configService.get<number>('PORT') ?? 4000
	await app.listen(port)
	const url = await app.getUrl()
	console.log(`	🚀Server running at ${url}`)
	console.log(`	Docs running at ${url}/docs`)
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
	app.use('/docs', apiReference({ spec: { content: doc } }))
}

patchNestJsSwagger()
void bootstrap()
