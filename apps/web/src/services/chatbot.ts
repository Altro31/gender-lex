"use server";

import { getApiClient } from "@/lib/api/client";
import { actionClient } from "@/lib/safe-action";
import type { ChatbotApp } from "@repo/types/api";
import { parseResponse } from "hono/client";
import { z } from "zod";

const client = getApiClient<ChatbotApp>()


export const sendMessage = actionClient
  .inputSchema(z.object({ content: z.string() }))
  .action(async ({ parsedInput: body }) => {
    const data = await parseResponse(client.chatbot.message.$post(body));
    return { success: true, data };
  });

export async function getMessages() {
  "use cache: private";
  return parseResponse(client.chatbot.messages.$get());
}
