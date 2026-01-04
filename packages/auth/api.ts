import { betterAuth } from "better-auth";
import { baseOptions } from "./src/base.ts";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  ...baseOptions,
  plugins: [...baseOptions.plugins, openAPI()],
});
