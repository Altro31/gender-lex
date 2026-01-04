import { isFile } from "@/lib/file"
import { ExtractorService } from "@/modules/extractor/service"
import { Effect } from "effect"

interface Args {
    resource: string | File
}

export async function extractContent({ resource }: Args) {
    "use step"
    console.log("extractContent")
    const program = Effect.gen(function* () {
        const extractorService = yield* ExtractorService

        return isFile(resource)
            ? yield* extractorService.extractPDFText(resource)
            : resource
    }).pipe(ExtractorService.provide)

    return Effect.runPromise(program)
}
