import { LocalStorageEvent } from "@/lib/events/local-storage";
import { useSyncExternalStore } from "react";

export function useLocalStorage<T extends string>(key: string) {
  const value = useSyncExternalStore(
    (sub) => () =>
      window.addEventListener("local-storage", (e) => {
        if (e instanceof LocalStorageEvent && e.key === key) {
          sub();
        }
      }),
    () => localStorage.getItem(key) as T | null
  );

  const handleValue = (value: T) => {
    localStorage.setItem(key, value);
    const event = new LocalStorageEvent({ key, value });
    dispatchEvent(event);
  };
  return [value, handleValue] as const;
}
