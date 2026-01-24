import { Schema } from "effect";

export type Pagination = typeof Pagination.Type;
export const Pagination = Schema.Struct({
  page: Schema.NumberFromString.pipe(
    Schema.positive({ default: 1 }),
    Schema.optional
  ),
  pageSize: Schema.NumberFromString.pipe(
    Schema.positive({ default: 10 }),
    Schema.optional
  ),
});
