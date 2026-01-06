import envs from "@/lib/env/env-server";
import { hc } from "hono/client";
import type { App } from "@repo/types/api";
import { cookies } from "next/headers";
import "server-only";

// Note: Client API usage needs to be updated from Eden syntax to Hono RPC syntax
// Example: client.analysis.prepare.post() becomes client.analysis.prepare.$post()
export const client = hc<App>(envs.API_URL, {
  fetch: async (input, options) => {
    const headers = new Headers(options?.headers);
    const cookiesStore = await cookies();
    headers.set("cookie", cookiesStore.toString());
    return fetch(input, { ...options, headers });
  },
});
