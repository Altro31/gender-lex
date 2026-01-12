import { Context, Data } from "effect"
import type {
    AISDKError,
    APICallError,
    RetryError,
    JSONParseError,
    DownloadError,
    LoadAPIKeyError,
    NoSuchToolError,
    StaticToolError,
    LoadSettingError,
    DynamicToolError,
    NoSuchModelError,
    NoSuchProviderError,
    InvalidPromptError,
    TypeValidationError,
    InvalidArgumentError,
} from "ai"

export class AiRequestError extends Data.TaggedError("AiRequestError")<{
    error:
        | AISDKError
        | APICallError
        | RetryError
        | JSONParseError
        | DownloadError
        | LoadAPIKeyError
        | NoSuchToolError
        | LoadSettingError
        | DynamicToolError
        | NoSuchModelError
        | NoSuchProviderError
        | InvalidPromptError
        | TypeValidationError
        | InvalidArgumentError
}> {}
