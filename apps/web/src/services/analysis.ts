"use server";

import { client } from "@/lib/api/client";
import { getSession } from "@/lib/auth/auth-server";
import { getDB } from "@/lib/db/client";
import { actionClient } from "@/lib/safe-action";
import type { HomeSchema } from "@/sections/home/form/home-schema";
import { cacheTag, updateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import z from "zod";

export async function prepareAnalysis(input: HomeSchema) {
  const { data, error } = await client.analysis.prepare.post({
    text: input.text,
    files: input.files.map((i) => i.file),
    selectedPreset: input.selectedPreset.id,
  });
  if (error) {
    console.error(JSON.stringify(error, null, "\t"));
    return { data: undefined, error };
  }
  updateTag("analyses");
  return { data, error: null };
}

export const deleteAnalysis = actionClient
  .inputSchema(z.string())
  .action(async ({ parsedInput: id }) => {
    const session = await getSession();
    if (!session) unauthorized();
    await client.analysis({ id }).delete();
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

  const { error, data } = await client.analysis.get({
    query: {
      q: query.q || "",
      page: query.page ? Number(query.page) : 1,
      status: (query.status as any) || undefined,
    },
  });
  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function findOneAnalysis(id: string) {
  const { data, error } = await client.analysis({ id }).get();
  if (error) {
    console.log(JSON.stringify(error, null, "\t"));
    throw new Error();
  }
  let analysis = (await data.next()).value!.data;
  return analysis;
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

  const { error, data } = await client.analysis["status-count"].get();
  console.log("Error:", JSON.stringify(error, null, "\t"));
  if (error) throw new Error(error.value.summary);
  return data;
}

export async function redoAnalysis(id: string) {
  const { data, error } = await client.analysis({ id }).redo.post();
  if (error) {
    console.error(error);
    return { error };
  }
  updateTag("analyses");
  updateTag(`analysys-${id}`);
  return { data, error: null };
}
