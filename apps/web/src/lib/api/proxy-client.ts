import { hc } from "hono/client";
import type { App } from "@repo/types/api";
import envs from "../env/env-server";

// Note: Client API usage needs to be updated from Eden syntax to Hono RPC syntax
// Example: client.analysis.prepare.post() becomes client.analysis.prepare.$post()
export const proxyClient = hc<App>(
  process.env.NEXT_PUBLIC_UI_URL! + "/api/proxy",
  {
    fetch: async (input, options) => {
      const headers = new Headers(options?.headers);
      headers.set("cookie", window.cookieStore.toString());
      return fetch(input, { ...options, headers });
    },
  },
);
