import { clientFactory } from "@/lib/api/base-client";
import envs from "@/lib/env/env-server";
import type { Hono } from "hono";
import { cookies } from "next/headers";
import "server-only";

export function getApiClient<T extends Hono>() {
  return clientFactory<T>({
    cookies: async () => (await cookies()).toString(),
    url: () => envs.API_URL,
  });
}
