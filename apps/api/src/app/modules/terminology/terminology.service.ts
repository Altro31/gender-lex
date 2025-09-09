import { Injectable, type OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { EnvTypes } from 'src/app.module'
import { UMLSJS } from 'umlsjs'

const Token = UMLSJS.UMLSToken

@Injectable()
export class TerminologyService implements OnModuleInit {
	private token: InstanceType<typeof Token>
	constructor(private readonly configService: ConfigService<EnvTypes>) {}

	onModuleInit() {
		this.token = new Token(this.configService.getOrThrow('UMLS_API_URL'))
	}

	async search(term: string) {
		const st = await this.token.getSt()
		const searcher = new UMLSJS.UMLSSearch(st)
		await searcher.init(term)
		await searcher.query()
		return searcher.getResults()
	}
}
