import { AuthService } from '@mguay/nestjs-better-auth'
import { type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { type OpenAPIObject } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import * as cors from 'cors'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { ClsService } from 'nestjs-cls'
import * as path from 'path'
import { generateDocs } from 'src/core/utils/docs'
import { GlobalAuthGuard } from 'src/security/modules/auth/guards/global-auth.guard'
import { AppModule, type EnvTypes } from './app.module'
import { Console, Effect } from 'effect'

const program = Effect.tryPromise(async () => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bodyParser: false,
	})
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
	return app.getUrl()
}).pipe(
	Effect.tap(url => Console.log(`	🚀Server running at ${url}`)),
	Effect.tap(url => Console.log(`	Docs running at ${url}/docs`)),
	Effect.tap(url => Console.log(`	Zen docs running at ${url}/docs/zen`)),
)

function openapi(app: INestApplication) {
	try {
		const doc: OpenAPIObject | undefined = yaml.load(
			fs.readFileSync(
				path.join(process.cwd(), './public/openapi.yaml'),
				'utf8',
			),
		) as OpenAPIObject

		app.use('/docs', apiReference({ spec: { content: doc } }))
	} catch (e) {
		console.log(e)
		console.warn('OpenApi spec cannot be loaded')
	}

	try {
		const doc: OpenAPIObject | undefined = yaml.load(
			fs.readFileSync(
				path.join(process.cwd(), './public/openapi-zen.yaml'),
				'utf8',
			),
		) as OpenAPIObject
		app.use('/docs-zen', apiReference({ spec: { content: doc } }))
	} catch (e) {
		console.log(e)
		console.warn('OpenApi-Zen spec cannot be loaded')
	}
}

void Effect.runPromise(program)
