import { NestiaSwaggerComposer } from '@nestia/sdk'
import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { OpenAPIObject } from '@nestjs/swagger'
import * as fs from 'fs/promises'
import * as yaml from 'js-yaml'
import { dirname } from 'path'
import type { EnvTypes } from 'src/app.module'

export async function generateDocs(app: INestApplication) {
	const specPath = require.resolve('@repo/db/openapi.yaml')

	const configService = app.get(ConfigService<EnvTypes>)

	const isDevEnv = process.env.NODE_ENV !== 'production'
	const document = await NestiaSwaggerComposer.document(app, {
		beautify: true,
		security: {
			'better-auth': {
				type: 'apiKey',
				in: 'cookie',
				name: 'better-auth.session',
			},
			'better-auth-prod': {
				type: 'apiKey',
				in: 'cookie',
				name: '_Secure-better-auth.session',
			},
		},
		servers: [
			{ description: isDevEnv ? 'Local' : 'Host', url: '/' },
			...(isDevEnv
				? [
						{
							url: 'https://gender-lex.onrender.com',
							description: 'Production',
						},
					]
				: []),
		],
		info: {
			description: `Zen-Api Docs at ${configService.getOrThrow('BETTER_AUTH_URL')}/docs-zen`,
		},
	})

	let documentZen: OpenAPIObject | undefined
	try {
		const loadedSpec = await fs.readFile(specPath, 'utf8')
		documentZen = yaml.load(loadedSpec) as OpenAPIObject
	} catch (e) {
		console.log(e)
	}

	const documents = [
		{ filePath: './public/openapi.yaml', document },
		{ filePath: './public/openapi-zen.yaml', document: documentZen },
	]

	await Promise.all(
		documents.map(async ({ document, filePath }) => {
			await fs.mkdir(dirname(filePath), { recursive: true })
			await fs.writeFile(filePath, yaml.dump(document))
		}),
	)
}
