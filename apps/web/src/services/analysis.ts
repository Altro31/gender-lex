"use server";

import { getApiClient } from "@/lib/api/client";
import { handle } from "@/lib/api/util";
import { getSession } from "@/lib/auth/auth-server";
import { getDB } from "@/lib/db/client";
import { actionClient } from "@/lib/safe-action";
import type { HomeSchema } from "@/sections/home/form/home-schema";
import type { AnalysisApp } from "@repo/types/api";
import { DetailedError, parseResponse } from "hono/client";
import { cacheTag, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";
import z from "zod";

const client = getApiClient<AnalysisApp>();

export async function prepareAnalysis(input: HomeSchema) {
  const res = await handle(
    client.analysis.prepare.$post({
      form: {
        text: input.text,
        files: input.files.map((i) => i.file),
        selectedPreset: input.selectedPreset,
      },
    })
  );
  if (res.error) {
    console.error(res.error);
    return res;
  }
  updateTag("analyses");
  return res;
}

export const deleteAnalysis = actionClient
  .inputSchema(z.string())
  .action(async ({ parsedInput: id }) => {
    const session = await getSession();
    if (!session) unauthorized();
    await parseResponse(client.analysis[":id"].$delete({ param: { id } }));
    updateTag("analyses");
  });

export async function findAnalyses(query: {
  q?: string;
  page?: string;
  status?: string;
}) {
  "use cache: private";
  cacheTag("analyses");

  const session = await getSession();
  if (!session) unauthorized();

  return parseResponse(
    client.analysis.$get({
      query,
    })
  );
}

export async function findRecentAnalyses() {
  "use cache: private";
  cacheTag(`analyses`);
  const db = await getDB();
  return db.analysis.findMany({ orderBy: [{ createdAt: "desc" }], take: 5 });
}

export async function getStatusCount() {
  "use cache: private";
  cacheTag(`analyses`);

  return parseResponse(client.analysis["status-count"].$get());
}

export async function redoAnalysis(id: string) {
  const res = await handle(
    client.analysis[":id"].redo.$post({ param: { id } })
  );
  if (res.error) {
    console.error(res.error);
    return res;
  }
  updateTag("analyses");
  updateTag(`analysys-${id}`);
  return res;
}
