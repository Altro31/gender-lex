import envs from "@/lib/env/env-server";
import type { Hono } from "hono";
import { hc } from "hono/client";
import { cookies } from "next/headers";
import "server-only";

export function getApiClient<T extends Hono>() {
  return hc<T>(envs.API_URL, {
    async fetch(input: any, options: any) {
      const headers = new Headers(options?.headers);
      const cookiesStore = await cookies();
      headers.set("cookie", cookiesStore.toString());
      return fetch(input, { ...options, headers });
    },
  });
}
