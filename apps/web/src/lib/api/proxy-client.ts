import { clientFactory } from "@/lib/api/base-client";
import type { Hono } from "hono";

export function getApiProxyClient<T extends Hono>() {
  return clientFactory<T>({
    cookies: () => window.cookieStore.toString(),
    url: () => process.env.NEXT_PUBLIC_UI_URL! + "/api/proxy",
  });
}
