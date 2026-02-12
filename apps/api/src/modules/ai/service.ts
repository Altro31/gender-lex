import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import type { Model } from "@repo/db/models"
import { Analysis as AnalysisSchema } from "@repo/db/schema/analysis.ts"
import { Effect, JSONSchema, Schema } from "effect"

export class AiService extends Effect.Service<AiService>()("AiService", {
    effect: Effect.gen(function* () {
        return {
            buildLanguageModel: Effect.fn("buildLanguageModel")(function* (
                model: Model,
            ) {
                const provider = createOpenAICompatible({
                    baseURL: model.connection.url,
                    name: model.name,
                    apiKey: model.apiKey ?? undefined,
                    supportsStructuredOutputs: true,
                    // @ts-expect-error - The type definitions for createOpenAICompatible are not accurate
                    fetch: async (input, init) => {
                        const { body: initBody, ...rest } = init!

                        const schema = {
                            type: "json_schema",
                            json_schema: {
                                strict: true,
                                schema: JSONSchema.make(
                                    AnalysisSchema.pipe(
                                        Schema.omit(
                                            "_tag",
                                            "createdAt",
                                            "id",
                                            "inputSource",
                                            "presetId",
                                            "status",
                                            "updatedAt",
                                            "userId",
                                            "visibility",
                                            "workflow",
                                        ),
                                    ),
                                ),
                            },
                        }

                        const program = Effect.succeed(initBody as string).pipe(
                            Effect.andThen(v =>
                                Effect.succeed(JSON.parse(v) as object),
                            ),
                            Effect.andThen(v =>
                                Effect.succeed(
                                    Object.assign(v, {
                                        response_format: schema,
                                    }),
                                ),
                            ),
                            Effect.andThen(v =>
                                Effect.succeed(JSON.stringify(v)),
                            ),
                        )
                        const body = Effect.runSync(program)
                        return fetch(input, { ...rest, body })
                    },
                })
                return {
                    languageModel: provider(model.connection.identifier),
                    options: model.settings,
                }
            }),
        }
    }).pipe(Effect.withSpan("AiService")),
}) {
    static provide = Effect.provide(this.Default)
}
