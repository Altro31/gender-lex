import envs from "@/lib/env/env-server";
import { treaty } from "@elysiajs/eden";
import type { App } from "@repo/types/api";
import { cookies } from "next/headers";
import "server-only";

export const client = treaty<App>(envs.API_URL, {
  fetcher: async (path, options) => {
    const headers = new Headers(options?.headers);
    const cookiesStore = await cookies();
    headers.set("cookie", cookiesStore.toString());
    return fetch(path, { ...options, headers });
  },
});
