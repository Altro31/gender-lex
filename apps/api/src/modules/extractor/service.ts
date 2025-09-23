import env from "@/lib/env"
import Elysia from "elysia"
import {
    ExtractElementType,
    ExtractPDFJob,
    ExtractPDFParams,
    ExtractPDFResult,
    MimeType,
    PDFServices,
    ServicePrincipalCredentials,
} from "@adobe/pdfservices-node-sdk"
import { Readable, Writable } from "stream"
import AdmZip from "adm-zip"

export const extractorService = new Elysia({ name: "extractor.service" })
    .use(env)
    .derive({ as: "global" }, ({ env }) => {
        const credentials = new ServicePrincipalCredentials({
            clientId: env.PDF_SERVICES_CLIENT_ID,
            clientSecret: env.PDF_SERVICES_CLIENT_SECRET,
        })

        const extractor = new PDFServices({ credentials })

        return {
            extractorService: {
                async extractPDFText(file: File) {
                    const bytes = new Uint8Array(await file.arrayBuffer())
                    const newFile = new File([bytes], "file")

                    const fileResponse = await fetch(
                        URL.createObjectURL(newFile),
                    )

                    const readStream = Readable.fromWeb(
                        fileResponse.body as any,
                    )

                    const inputAsset = await extractor.upload({
                        readStream: readStream,
                        mimeType: MimeType.PDF,
                    })

                    const params = new ExtractPDFParams({
                        elementsToExtract: [ExtractElementType.TEXT],
                    })

                    const job = new ExtractPDFJob({ inputAsset, params })

                    const pollingURL = await extractor.submit({ job })
                    const pdfServicesResponse = await extractor.getJobResult({
                        pollingURL,
                        resultType: ExtractPDFResult,
                    })

                    const resultAsset = pdfServicesResponse.result?.resource

                    if (!resultAsset) return ""

                    const streamAsset = await extractor.getContent({
                        asset: resultAsset,
                    })

                    let buffer = Buffer.alloc(0)

                    const writableStream = new Writable({
                        write(chunk, _, callback) {
                            buffer = Buffer.concat([buffer, chunk])
                            callback()
                        },
                    })

                    return new Promise<string>(resolve => {
                        streamAsset.readStream
                            .pipe(writableStream)
                            .on("finish", () => {
                                const zip = new AdmZip(buffer)
                                console.log("Zip creado en memoria")
                                const jsondata = zip.readAsText(
                                    "structuredData.json",
                                )
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                const data = JSON.parse(jsondata)
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                                const text = data.elements.reduce(
                                    (acc: string, curr: any) =>
                                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                        curr.Text
                                            ? acc + "\n" + curr.Text
                                            : acc,
                                    "",
                                )
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                resolve(text)
                            })
                    })
                },
            },
        }
    })
