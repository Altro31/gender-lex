import z from "zod"
import { Model } from "@repo/db/schema/model.ts"
import { Schema } from "effect"

export const modelDTOs = {
    createModelInput: Schema.standardSchemaV1(
        Model.pipe(Schema.pick("apiKey", "connection", "name", "settings")),
    ),
}
