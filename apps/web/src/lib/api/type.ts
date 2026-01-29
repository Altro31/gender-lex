import type { DetailedError } from "hono/client";

export type InferApiResponse<I extends (...args: any[]) => any> = Awaited<
  ReturnType<I>
>;

export type InferSuccess<I extends (...args: any[]) => any> = Exclude<
  InferApiResponse<I>,
  { error: DetailedError }
>;
