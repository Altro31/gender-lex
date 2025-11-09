import { Data } from "effect"

export class AnalysisNotFoundError extends Data.TaggedError(
    "AnalysisNotFoundError",
) {
    override readonly message = ""
}
