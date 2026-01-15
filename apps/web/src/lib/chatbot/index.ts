import { chatbotSystemPrompt } from "@/lib/chatbot/system.prompt";
import { RouteTools } from "@/lib/chatbot/tools/route-tools";
import envs from "@/lib/env/env-server";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { InferAgentUIMessage, ToolLoopAgent } from "ai";

const provider = createOpenAICompatible({
  name: "chatbot-provider",
  baseURL: envs.CHATBOT_PROVIDER_URL,
  apiKey: envs.CHATBOT_PROVIDER_API_KEY,
});

export const chatAgent = new ToolLoopAgent({
  model: provider(envs.CHATBOT_MODEL_IDENTIFIER),
  tools: { ...RouteTools.tools },
  instructions: chatbotSystemPrompt,
});

export type ChatbotMessage = InferAgentUIMessage<typeof chatAgent, never>;
