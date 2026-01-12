import { Schema } from "effect";
import { Model } from "@repo/db/schema/model.ts";
import type { StandardSchemaInfer } from "../utils/standard-schema";

export type CreateModelInput = StandardSchemaInfer<typeof CreateModelInput>;
export const CreateModelInput = Schema.standardSchemaV1(
  Model.pipe(Schema.pick("apiKey", "connection", "name", "settings"))
);
