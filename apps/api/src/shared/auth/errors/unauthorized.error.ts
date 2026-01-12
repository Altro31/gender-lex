import { type IHttpTaggedError } from "@/lib/types/http-error"
import { Data } from "effect"

// @HttpError()
export class UnauthorizedError
    extends Data.TaggedError("UnauthorizedError")
    implements IHttpTaggedError
{
    status = 401
    statusText = "Unauthorized"
}
