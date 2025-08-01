import type { INestApplication } from '@nestjs/common'
import {
	DocumentBuilder,
	SwaggerModule,
	type OpenAPIObject,
} from '@nestjs/swagger'
import { isErrorResult, merge } from 'openapi-merge'
import * as fs from 'fs/promises'
import * as yaml from 'js-yaml'
import { dirname } from 'path'

export async function generateDocs(app: INestApplication) {
	const specPath = require.resolve('@repo/db/openapi.yaml')

	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Gender Lex Backend')
		.setVersion('1.0')
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config)
	let doc: OpenAPIObject | undefined
	try {
		const loadedSpec = await fs.readFile(specPath, 'utf8')
		doc = yaml.load(loadedSpec) as OpenAPIObject
	} catch (e) {
		console.log(e)
	}
	const result = merge([
		{ oas: documentFactory() as any },
		...(doc ? [{ oas: doc as any }] : []),
	])
	const document = isErrorResult(result) ? documentFactory() : result.output

	const filePath = './public/openapi.yaml'
	await fs.mkdir(dirname(filePath), { recursive: true })
	await fs.writeFile(filePath, yaml.dump(document))
}
