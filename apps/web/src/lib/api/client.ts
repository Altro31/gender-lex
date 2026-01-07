import envs from "@/lib/env/env-server";
import { ClientResponse, DetailedError, hc, parseResponse } from "hono/client";
import type { App } from "@repo/types/api";
import { cookies } from "next/headers";
import "server-only";

export const client = hc<App>(envs.API_URL, {
  async fetch(input: any, options: any) {
    const headers = new Headers(options?.headers);
    const cookiesStore = await cookies();
    headers.set("cookie", cookiesStore.toString());
    return fetch(input, { ...options, headers });
  },
});
