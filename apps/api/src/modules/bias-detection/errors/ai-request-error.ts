import type {
    AISDKError,
    APICallError,
    DownloadError,
    DynamicToolError,
    InvalidArgumentError,
    InvalidPromptError,
    JSONParseError,
    LoadAPIKeyError,
    LoadSettingError,
    NoSuchModelError,
    NoSuchProviderError,
    NoSuchToolError,
    RetryError,
    TypeValidationError,
} from "ai"
import { Data } from "effect"
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
