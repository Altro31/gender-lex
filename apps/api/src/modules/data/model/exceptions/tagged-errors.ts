import type { ModelError } from "@repo/db/models"
import { Data } from "effect"

interface IModelError {
    readonly modelError: ModelError
}

export class InvalidModelApiKeyError
    extends Data.TaggedError("InvalidModelApiKeyError")
    implements IModelError
{
    readonly modelError = "INVALID_API_KEY" satisfies ModelError
}

export class InvalidModelIdentifierError
    extends Data.TaggedError("InvalidModelIdentifierError")
    implements IModelError
{
    readonly modelError = "INVALID_IDENTIFIER" satisfies ModelError
}

export class InactiveModelError
    extends Data.TaggedError("InactiveModelError")
    implements IModelError
{
    readonly modelError = "INACTIVE_MODEL" satisfies ModelError
}
