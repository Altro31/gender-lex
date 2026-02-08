"use client";

import type { ChatbotMessage } from "@/lib/chatbot";
import { prepareAnalysis } from "@/services/analysis";
import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useRouter } from "next/navigation";
import React, { createContext, use, useState } from "react";

type ContextTag = { key: string | undefined; content?: any };

interface ChatbotContext {
  open: {
    value: boolean;
    set: (open: boolean) => void;
  };
  context: {
    value: ContextTag | undefined;
    set: (context: ContextTag | undefined) => void;
  };
}

const Context = createContext({} as ChatbotContext);

export function ChatbotProvider({ children }: React.PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<ContextTag | undefined>();

  const handleContext = (context: ContextTag | undefined) => {
    setOpen(true);
    setContext(context);
  };

  const value = {
    open: {
      value: open,
      set: setOpen,
    },
    context: {
      value: context,
      set: handleContext,
    },
  };
  return <Context value={value}>{children}</Context>;
}

export function useChatbot() {
  const context = use(Context);

  return {
    ...context,
    get chat() {
      const router = useRouter();
      const chat = useChat<ChatbotMessage>({
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
        async onToolCall({ toolCall }) {
          if (toolCall.dynamic) return;
          if (toolCall.toolName === "navigateTo") {
            router.push(toolCall.input.route);
            return;
          }
          if (toolCall.toolName === "analice") {
            const res = await prepareAnalysis({
              text: toolCall.input.text,
              filesObj: [],
            });
            if (res.error) {
              console.error(res.error.message);
              chat.addToolOutput({
                tool: toolCall.toolName,
                toolCallId: toolCall.toolCallId,
                errorText: "Failed to excecute analysis",
                state: "output-error",
              });
              return;
            }
            router.push(`/analysis/${res.data.id}`);
            chat.addToolOutput({
              tool: toolCall.toolName,
              toolCallId: toolCall.toolCallId,
              state: "output-available",
              output: "Analysis successfully",
            });
            return;
          }
        },
      });
      return chat;
    },
  };
}
