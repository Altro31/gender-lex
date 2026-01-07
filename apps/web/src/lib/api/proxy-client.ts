import type { App } from "@repo/types/api";
import { hc } from "hono/client";

export const proxyClient = hc<App>(
  process.env.NEXT_PUBLIC_UI_URL! + "/api/proxy",
  {
    fetch: async (input: any, options: any) => {
      const headers = new Headers(options?.headers);
      headers.set("cookie", window.cookieStore.toString());
      return fetch(input, { ...options, headers });
    },
  },
);
