import { ZenStackClient } from "@zenstackhq/orm";
import { PostgresDialect } from "@zenstackhq/orm/dialects/postgres";
import { PolicyPlugin } from "@zenstackhq/plugin-policy";
import {
  RestApiHandler,
  type RestApiHandlerOptions,
} from "@zenstackhq/server/api";
import { Pool } from "pg";
import { schema } from "./generated/schema.ts";
export type { ClientContract } from "@zenstackhq/orm";
export type { SchemaType } from "./generated/schema.ts";

export { ORMErrorReason } from "@zenstackhq/orm";

export const db = new ZenStackClient(schema, {
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  }),
});

export const authDB = db.$use(new PolicyPlugin());

type Options = Omit<RestApiHandlerOptions, "schema">;
export class ApiHandler extends RestApiHandler {
  constructor(options: Options) {
    super({ schema, ...options });
  }
}
