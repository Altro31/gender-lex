import { Chunk, Console, Effect, Option, Stream } from "effect";
import { constant } from "effect/Function";
import { type ClientResponse, DetailedError, parseResponse } from "hono/client";
import { consumeSSEStream } from "@geee-be/sse-stream-parser";

export async function handle<T extends ClientResponse<any>>(
  fetchRes: T | Promise<T>
) {
  try {
    const data = await parseResponse(fetchRes);
    return { data, error: undefined };
  } catch (error) {
    return { data: undefined, error: error as DetailedError };
  }
}

export async function handleStream<T>(
  fetchRes: ClientResponse<T> | Promise<ClientResponse<T>>
) {
  const res = await fetchRes;
  const stream = Stream.async<{ type: string; data: T }>((emit) => {
    consumeSSEStream(res.clone().body!, (e) => {
      emit(
        Effect.succeed(
          Chunk.of({ type: e.event ?? "message", data: JSON.parse(e.data) })
        )
      );
    }).then(() => emit(Effect.fail(Option.none())));
  });

  return Object.assign(Stream.toReadableStream(stream), {
    [Symbol.asyncIterator]: () =>
      Stream.toAsyncIterable(stream)[Symbol.asyncIterator](),
  });
}
