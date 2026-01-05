import { treaty } from "@elysiajs/eden";
import type { App } from "@repo/types/api";

export const proxyClient = treaty<App>(process.env.NEXT_PUBLIC_API_URL!, {
  fetcher: async (path, options) => {
    const headers = new Headers(options?.headers);
    headers.set("cookie", window.cookieStore.toString());
    return fetch(path, { ...options, headers });
  },
});
