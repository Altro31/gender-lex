import { chatbotSystemPrompt } from "@/lib/chatbot/system.prompt";
import { analysisTools } from "@/lib/chatbot/tools/analysis-tools";
import { routeTools } from "@/lib/chatbot/tools/route-tools";
import envs from "@/lib/env/env-server";
import { google } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { InferAgentUIMessage, ToolLoopAgent } from "ai";

const provider = createOpenAICompatible({
  name: "chatbot-provider",
  baseURL: envs.CHATBOT_PROVIDER_URL,
  apiKey: envs.CHATBOT_PROVIDER_API_KEY,
});

export const chatAgent = new ToolLoopAgent({
  model: provider(envs.CHATBOT_MODEL_IDENTIFIER),
  tools: { ...routeTools, ...analysisTools },
  instructions: chatbotSystemPrompt,
});
type Metadata = { context?: { key: string } };
export type ChatbotMessage = InferAgentUIMessage<typeof chatAgent, Metadata>;
