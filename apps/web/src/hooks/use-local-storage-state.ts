import { useEffect, useState, useSyncExternalStore } from "react";

export function useCookieState(name: string, defaultValue?: string) {
  const [cookie, setCookie] = useState(defaultValue);

  useEffect(() => {
    const hanldeChange = (ev: CookieChangeEvent) => {
      console.log("Hola");
      ev.changed.forEach((c) => {
        if (c.name === name) setCookie(c.value);
      });
    };

    cookieStore.addEventListener("change", hanldeChange);
    return cookieStore.removeEventListener("change", hanldeChange);
  }, [setCookie]);

  return [cookie, (value: string) => cookieStore.set(name, value)] as const;
}
