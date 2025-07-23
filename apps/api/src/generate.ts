import { NestFactory } from '@nestjs/core'
import {
	DocumentBuilder,
	SwaggerModule,
	type OpenAPIObject,
} from '@nestjs/swagger'
import * as fs from 'fs/promises'
import * as yaml from 'js-yaml'
import { isErrorResult, merge } from 'openapi-merge'
import { AppModule } from 'src/app.module'

async function generate() {
	const specPath = require.resolve('@repo/db/openapi.yaml')
	const app = await NestFactory.create(AppModule)

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

	await fs.writeFile('./public/openapi.yaml', yaml.dump(document))
}

void generate()
