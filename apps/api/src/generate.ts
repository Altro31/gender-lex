import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { generateDocs } from 'src/core/utils/docs'

async function generate() {
	const app = await NestFactory.create(AppModule)
	await generateDocs(app)
}

void generate()
