import type { $Enums } from "@repo/db/models"
import { Data } from "effect"

interface IModelError {
    readonly modelError: $Enums.ModelError
}

export class InvalidModelApiKeyError
    extends Data.TaggedError("InvalidModelApiKeyError")
    implements IModelError
{
    readonly modelError = "INVALID_API_KEY" satisfies $Enums.ModelError
}

export class InvalidModelIdentifierError
    extends Data.TaggedError("InvalidModelIdentifierError")
    implements IModelError
{
    readonly modelError = "INVALID_IDENTIFIER" satisfies $Enums.ModelError
}

export class InactiveModelError
    extends Data.TaggedError("InactiveModelError")
    implements IModelError
{
    readonly modelError = "INACTIVE_MODEL" satisfies $Enums.ModelError
}
