import { Stream } from "effect";
import { constant } from "effect/Function";
import { type ClientResponse, DetailedError, parseResponse } from "hono/client";

export async function handle<T extends ClientResponse<any>>(
  fetchRes: T | Promise<T>,
) {
  try {
    const data = await parseResponse(fetchRes);
    return { data, error: undefined };
  } catch (error) {
    return { data: undefined, error: error as DetailedError };
  }
}

export async function handleStream<T>(
  fetchRes: ClientResponse<T> | Promise<ClientResponse<any>>,
) {
  const res = await fetchRes;
  return Stream.fromReadableStream({
    evaluate: constant(res.body!),
    onError: (error) => console.error(error),
  }).pipe(
    Stream.decodeText(),
    Stream.map((i) => i.replace(/^data:/, "")),
    Stream.map((i) => JSON.parse(i) as { data: T }),
    Stream.toAsyncIterable,
  );
}
