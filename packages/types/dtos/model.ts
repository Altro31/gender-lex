import { Model } from "@repo/db/schema/model.ts";
import { Schema } from "effect";

export type CreateModelInput = typeof CreateModelInput.Type;
export const CreateModelInput = Schema.standardSchemaV1(
  Model.pipe(Schema.pick("apiKey", "connection", "name", "settings"))
);
