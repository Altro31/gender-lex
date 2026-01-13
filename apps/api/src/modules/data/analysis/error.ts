import { type IHttpTaggedError } from "@/lib/types/http-error"
import { Data } from "effect"

// @HttpError()
export class AnalysisNotFoundError
    extends Data.TaggedError("AnalysisNotFoundError")
    implements IHttpTaggedError
{
    status = 404
    statusText = "Analysis not found"
}
