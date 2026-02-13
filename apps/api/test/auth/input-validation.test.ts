import {
    AnalysisFindManyQueryParams,
    PrepareAnalyisisInput,
} from "@repo/types/dtos/analysis"
import { CreateModelInput } from "@repo/types/dtos/model"
import AdmZip from "adm-zip"
import { beforeEach, describe, expect, it, mock } from "bun:test"
import { Schema } from "effect"
import { Readable } from "stream"

const buildStructuredDataBuffer = (elements: any[]) => {
    const zip = new AdmZip()
    zip.addFile(
        "structuredData.json",
        Buffer.from(JSON.stringify({ elements }), "utf8"),
    )
    return zip.toBuffer()
}

let structuredDataBuffer = buildStructuredDataBuffer([])

class FakePDFServices {
    upload() {
        return Promise.resolve({ assetId: "input" })
    }
    submit() {
        return Promise.resolve("polling-url")
    }
    getJobResult() {
        return Promise.resolve({ result: { resource: { id: "resource" } } })
    }
    getContent() {
        return Promise.resolve({
            readStream: Readable.from([structuredDataBuffer]),
        })
    }
}

mock.module("@adobe/pdfservices-node-sdk", () => ({
    PDFServices: FakePDFServices,
    ExtractElementType: { TEXT: "TEXT" },
    ExtractPDFJob: class {},
    ExtractPDFParams: class {},
    ExtractPDFResult: class {},
    MimeType: { PDF: "application/pdf" },
    ServicePrincipalCredentials: class {},
}))

beforeEach(() => {
    structuredDataBuffer = buildStructuredDataBuffer([])
})

describe("Zod form validation", () => {
    it("requires either plain text or uploaded files", () => {
        const result = PrepareAnalyisisInput.safeParse({ text: "", files: [] })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0]?.message).toContain("text")
    })

    it("accepts valid file uploads", () => {
        const file = new File(["hola"], "analysis.txt", { type: "text/plain" })
        const result = PrepareAnalyisisInput.safeParse({ files: [file] })
        expect(result.success).toBe(true)
    })

    it("rejects invalid analysis status filters", () => {
        const decode = Schema.decodeUnknownEither(AnalysisFindManyQueryParams)
        const invalid = decode({ page: 1, pageSize: 10, status: "invalid" })
        expect(invalid._tag).toBe("Left")
    })

    it("validates model creation payloads", () => {
        const decode = Schema.decodeUnknownEither(CreateModelInput)
        const payload = {
            apiKey: "sk-live-123",
            name: "model",
            connection: { identifier: "gpt", url: "https://api.example.com" },
            settings: { temperature: 0.2 },
        }
        const result = decode(payload)
        expect(result._tag).toBe("Right")
    })
})

// describe("Document sanitization", () => {
//     it("drops non-text elements from extracted PDF streams", async () => {
//         structuredDataBuffer = buildStructuredDataBuffer([
//             { Text: "The document summary" },
//             { Path: "/tmp/malicious" },
//             { Text: "Only readable text is returned" },
//         ])

//         const extractor = await Effect.gen(function* () {
//             return yield* ExtractorService
//         }).pipe(
//             Effect.provideService(EnvsService, {
//                 PDF_SERVICES_CLIENT_ID: "client",
//                 PDF_SERVICES_CLIENT_SECRET: "secret",
//             } as any),
//             ExtractorService.provide,
//             Effect.runPromise,
//         )

//         const stream = new ReadableStream({
//             start(controller) {
//                 controller.enqueue(new Uint8Array())
//                 controller.close()
//             },
//         })

//         const result = await Effect.runPromise(extractor.extractPDFText(stream))

//         expect(result).toContain("document summary")
//         expect(result).toContain("Only readable text")
//         expect(result).not.toContain("malicious")
//     })
// })

// describe("Model API key validation", () => {
//     it("fails fast when the upstream rejects an API key", async () => {
//         const httpClient = {
//             get: () =>
//                 Effect.succeed({
//                     status: 401,
//                     json: Effect.succeed({ data: [] }),
//                 }),
//         }

//         const sseStub = {
//             stream$: Stream.empty,
//             broadcast: () => Effect.succeed(true),
//         }

//         const repository = {
//             findUnique: mock(() =>
//                 Promise.resolve({
//                     id: "model-1",
//                     apiKey: "sk-invalid",
//                     connection: {
//                         url: "https://llm.example.com",
//                         identifier: "llm",
//                     },
//                     settings: { temperature: 0.2 },
//                 }),
//             ),
//             update: mock(() => Promise.resolve({})),
//         }

//         const modelLayer = ModelService.Default.pipe(
//             Layer.provide(Layer.succeed(HttpService, httpClient as any)),
//             Layer.provide(Layer.succeed(SseService, sseStub as any)),
//             Layer.provide(Layer.succeed(ModelRepository, repository as any)),
//             Layer.provide(
//                 Layer.succeed(ContextService, {
//                     req: { raw: { headers: new Headers() } },
//                 } as any),
//             ),
//             Layer.provide(
//                 Layer.succeed(UserProviderService, {
//                     user: { id: "tester" } as any,
//                 }),
//             ),
//         )

//         await expect(
//             Effect.gen(function* () {
//                 const service = yield* ModelService
//                 return yield* service.testConnection("model-1")
//             }).pipe(Effect.provide(modelLayer), Effect.runPromise),
//         ).rejects.toBeInstanceOf(InvalidModelApiKeyError)

//         expect(repository.update).toHaveBeenCalled()
//     })
// })
