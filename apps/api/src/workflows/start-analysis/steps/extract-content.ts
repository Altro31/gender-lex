import { ExtractorService } from "@/modules/extractor/service"
import { Effect } from "effect"

export async function extractContent(resource: ReadableStream | string) {
    "use step"
    const program = Effect.gen(function* () {
        const extractorService = yield* ExtractorService

        return typeof resource === "string"
            ? resource
            : yield* extractorService.extractPDFText(resource)
    }).pipe(ExtractorService.provide)

    return Effect.runPromise(program)
}
