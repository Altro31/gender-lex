import {
	PDFServices,
	ServicePrincipalCredentials,
} from '@adobe/pdfservices-node-sdk'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { EnvTypes } from 'src/app.module'

import {
	ExtractElementType,
	ExtractPDFJob,
	ExtractPDFParams,
	ExtractPDFResult,
	MimeType,
} from '@adobe/pdfservices-node-sdk'
import * as AdmZip from 'adm-zip'
import { Readable, Writable } from 'node:stream'

@Injectable()
export class ExtractorService extends PDFServices {
	constructor(private readonly config: ConfigService<EnvTypes>) {
		const PDF_SERVICES_CLIENT_ID = config.get<string>(
			'PDF_SERVICES_CLIENT_ID',
			'',
		)
		const PDF_SERVICES_CLIENT_SECRET = config.get<string>(
			'PDF_SERVICES_CLIENT_SECRET',
			'',
		)
		const credentials = new ServicePrincipalCredentials({
			clientId: PDF_SERVICES_CLIENT_ID,
			clientSecret: PDF_SERVICES_CLIENT_SECRET,
		})
		super({ credentials })
	}

	async extractPDFText(file: File) {
		const bytes = new Uint8Array(await file.arrayBuffer())
		const newFile = new File([bytes], 'file')

		const fileResponse = await fetch(URL.createObjectURL(newFile))

		const readStream = Readable.fromWeb(fileResponse.body as any)

		const inputAsset = await this.upload({
			readStream: readStream,
			mimeType: MimeType.PDF,
		})

		const params = new ExtractPDFParams({
			elementsToExtract: [ExtractElementType.TEXT],
		})

		const job = new ExtractPDFJob({ inputAsset, params })

		const pollingURL = await this.submit({ job })
		const pdfServicesResponse = await this.getJobResult({
			pollingURL,
			resultType: ExtractPDFResult,
		})

		const resultAsset = pdfServicesResponse.result?.resource

		if (!resultAsset) return ''

		const streamAsset = await this.getContent({ asset: resultAsset })

		let buffer = Buffer.alloc(0)

		const writableStream = new Writable({
			write(chunk, _, callback) {
				buffer = Buffer.concat([buffer, chunk])
				callback()
			},
		})

		return new Promise<string>(resolve => {
			streamAsset.readStream.pipe(writableStream).on('finish', () => {
				const zip = new AdmZip(buffer)
				console.log('Zip creado en memoria')
				const jsondata = zip.readAsText('structuredData.json')
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const data = JSON.parse(jsondata)
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
				const text = data.elements.reduce(
					(acc: string, curr: any) =>
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
						curr.Text ? acc + '\n' + curr.Text : acc,
					'',
				)
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				resolve(text)
			})
		})
	}
}
