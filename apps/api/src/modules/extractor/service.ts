import { EnvsService } from '@/shared/envs.service'
import { HttpService } from '@/shared/http.service'
import {
	ExtractElementType,
	ExtractPDFJob,
	ExtractPDFParams,
	ExtractPDFResult,
	MimeType,
	PDFServices,
	ServicePrincipalCredentials,
} from '@adobe/pdfservices-node-sdk'
import AdmZip from 'adm-zip'
import { Effect, Stream } from 'effect'
import { Readable, Writable } from 'stream'

export class ExtractorService extends Effect.Service<ExtractorService>()(
	'ExtractorService',
	{
		effect: Effect.gen(function* () {
			const env = yield* EnvsService
			const client = yield* HttpService
			const credentials = new ServicePrincipalCredentials({
				clientId: env.PDF_SERVICES_CLIENT_ID,
				clientSecret: env.PDF_SERVICES_CLIENT_SECRET,
			})
			const extractor = new PDFServices({ credentials })
			return {
				extractPDFText: (file: File) =>
					Effect.gen(function* () {
						const fileBuffer = yield* Effect.promise(
							file.arrayBuffer,
						)
						const bytes = new Uint8Array(fileBuffer)
						const newFile = new File([bytes], 'file')

						const fileResponse = yield* client.get(
							URL.createObjectURL(newFile),
						)
						const responseStream = fileResponse.stream.pipe(
							Stream.toReadableStream,
						)

						const readStream = Readable.fromWeb(
							responseStream as any,
						)

						const inputAsset = yield* Effect.promise(() =>
							extractor.upload({
								readStream: readStream,
								mimeType: MimeType.PDF,
							}),
						)

						const params = new ExtractPDFParams({
							elementsToExtract: [ExtractElementType.TEXT],
						})

						const job = new ExtractPDFJob({ inputAsset, params })

						const pollingURL = yield* Effect.promise(() =>
							extractor.submit({ job }),
						)

						const pdfServicesResponse = yield* Effect.promise(() =>
							extractor.getJobResult({
								pollingURL,
								resultType: ExtractPDFResult,
							}),
						)

						const resultAsset = pdfServicesResponse.result?.resource

						if (!resultAsset) return ''

						const streamAsset = yield* Effect.promise(() =>
							extractor.getContent({ asset: resultAsset }),
						)

						let buffer = Buffer.alloc(0)

						const writableStream = new Writable({
							write(chunk, _, callback) {
								buffer = Buffer.concat([buffer, chunk])
								callback()
							},
						})

						return yield* Effect.promise(
							() =>
								new Promise<string>(resolve => {
									streamAsset.readStream
										.pipe(writableStream)
										.on('finish', () => {
											const zip = new AdmZip(buffer)
											console.log('Zip creado en memoria')
											const jsondata = zip.readAsText(
												'structuredData.json',
											)
											// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
											const data = JSON.parse(jsondata)
											// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
											const text = data.elements.reduce(
												(acc: string, curr: any) =>
													// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
													curr.Text
														? acc + '\n' + curr.Text
														: acc,
												'',
											)
											// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
											resolve(text)
										})
								}),
						)
					}),
			}
		}),
		dependencies: [EnvsService.Default, HttpService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
