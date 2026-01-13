"use server";

import { getApiClient } from "@/lib/api/client";
import { getDB } from "@/lib/db/client";
import { actionClient } from "@/lib/safe-action";
import { ModelSchema } from "@/sections/model/form/model-schema";
import type { ModelApp } from "@repo/types/api";
import { CreateModelInput } from "@repo/types/dtos/model";
import { Schema } from "effect";
import { parseResponse } from "hono/client";
import { cacheTag, updateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod/mini";

const client = getApiClient<ModelApp>();

export async function findModels({
  q,
  page = "1",
}: {
  q?: string;
  page?: string;
}) {
  "use cache: private";
  cacheTag("models");
  const db = await getDB();
  return db.model.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    skip: (Number(page) - 1) * 10,
    take: 10,
    orderBy: [
      { isDefault: "asc" },
      { createdAt: "desc" },
      { updatedAt: "desc" },
    ],
  });
}

export const createModel = actionClient
  .inputSchema(ModelSchema)
  .action(async ({ parsedInput: body }) => {
    const data = await parseResponse(
      client.model.$post({
        json: {
          ...body,
          apiKey: body.apiKey ?? null,
        },
      })
    );

    updateTag("models");
    return { success: true, data };
  });

export const editModel = actionClient
  .inputSchema(
    Schema.standardSchemaV1(Schema.Tuple(Schema.String, CreateModelInput))
  )
  .action(async ({ parsedInput: [id, body] }) => {
    const db = await getDB();

    const data = await db.model.update({ where: { id }, data: body });
    after(() => testConnection(id));

    updateTag("models");
    updateTag(`model-${id}`);
    return { success: true, data };
  });

export const deleteModel = actionClient
  .inputSchema(z.string())
  .action(async ({ parsedInput: id }) => {
    const db = await getDB();
    await db.model.delete({ where: { id } });
    updateTag("models");
    return { success: true };
  });

export const testConnection = actionClient
  .inputSchema(z.string())
  .action(async ({ parsedInput: id }) => {
    const data = await parseResponse(
      client.model[":id"]["test-connection"].$post({
        param: { id },
      })
    );

    updateTag("models");
    updateTag(`model-${id}`);
    return { success: true, data };
  });

export const getModelsSelect = async ({ page }: { page: number }) => {
  "use cache: private";
  cacheTag("models");
  const db = await getDB();

  return db.model.findMany({
    skip: page * 20,
    take: 20,
    select: { id: true, name: true },
  });
};
