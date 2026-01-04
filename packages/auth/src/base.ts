import type { BetterAuthOptions } from "better-auth";
import { db } from "@repo/db/client";
import { zenstackAdapter } from "@zenstackhq/better-auth";
import { lastLoginMethod, oneTap } from "better-auth/plugins";

export const baseOptions = {
  trustedOrigins: [process.env.UI_URL ?? ""],
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      redirectURI: `${process.env.UI_URL ?? ""}/api/auth/callback/google`,
    },
    github: {
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
      redirectURI: `${process.env.UI_URL ?? ""}/api/auth/callback/github`,
    },
  },
  database: zenstackAdapter(db as any, { provider: "postgresql" }),
  plugins: [lastLoginMethod(), oneTap()],
} satisfies BetterAuthOptions;
