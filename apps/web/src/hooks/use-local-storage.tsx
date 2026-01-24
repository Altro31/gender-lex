import { useEffect, useState, useSyncExternalStore } from "react";

export function useLocalStorage<T extends string>(
  key: string,
  initialValue?: T
) {
  const value = useSyncExternalStore(
    (sub) => () =>
      window.addEventListener("storage", (e) => {
        console.log("Hola");

        if (e.key === key) {
          sub();
        }
      }),
    () => localStorage.getItem(key)
  );

  const handleValue = (value: T) => {
    localStorage.setItem(key, value);
  };
  return [value, handleValue] as const;
}
