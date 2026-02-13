import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { baseOptions } from "./src/base";

export const auth = betterAuth({
  ...baseOptions,
  plugins: [...baseOptions.plugins, nextCookies()],
});
