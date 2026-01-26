import { locale } from "next/root-params";
import { cache } from "react";
import "server-only";

export const getLocale = (): Promise<string> => {
  return locale();
};
