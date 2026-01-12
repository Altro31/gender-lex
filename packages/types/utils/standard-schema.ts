import { Schema } from "effect";

type StandardSchemaV1<A, I> = ReturnType<typeof Schema.standardSchemaV1<A, I>>;

export type StandardSchemaInfer<T> = T extends StandardSchemaV1<infer O, any>
  ? O
  : never;
