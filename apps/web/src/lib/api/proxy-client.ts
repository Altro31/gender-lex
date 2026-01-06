import { hc } from "hono/client";
import type { App } from "@repo/types/api";
import envs from "../env/env-server";

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
