import { type IHttpTaggedError } from "@/lib/types/http-error"
import { Data } from "effect"

// @HttpError()
export class ModelNotFoundError
    extends Data.TaggedError("ModelNotFoundError")
    implements IHttpTaggedError
{
    status = 404
    statusText = "Model not found"
}
