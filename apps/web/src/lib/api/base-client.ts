import type { Hono } from "hono";
import { hc } from "hono/client";

interface Args {
  url: () => string;
  cookies: () => string | Promise<string>;
}

export function clientFactory<T extends Hono>({ url, cookies }: Args) {
  const client = hc<T>(url(), {
    fetch: async (input: RequestInfo | URL, options?: RequestInit) => {
      const url = new URL(
        input instanceof URL || typeof input === "string" ? input : input.url
      );
      const pathname = url.pathname.replace("/auth$", "");
      url.pathname = pathname;
      const headers = new Headers(options?.headers);
      headers.set("cookie", await cookies());
      return fetch(url.toString(), { ...options, headers });
    },
  });
  type Client = typeof client;
  return client as Client & { auth$: Client };
}
