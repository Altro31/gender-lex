import type { Hono } from "hono";
import { hc } from "hono/client";

export function getApiProxyClient<T extends Hono>() {
  return hc<T>(
  process.env.NEXT_PUBLIC_UI_URL! + "/api/proxy",
  {
    fetch: async (input: any, options: any) => {
      const headers = new Headers(options?.headers);
      headers.set("cookie", window.cookieStore.toString());
      return fetch(input, { ...options, headers });
    },
  },
)
}

