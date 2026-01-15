"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { CopyIcon, MessageCircle, RefreshCcwIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "../ai-elements/loader";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { ChatbotMessage } from "@/lib/chatbot";

export default function FloatingChatbot() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, regenerate, stop } =
    useChat<ChatbotMessage>({
      async onToolCall({ toolCall }) {
        if (toolCall.dynamic) return;
        if (toolCall.toolName === "navigateTo") {
          console.log("Redirecting...");
          router.push((toolCall.input as any).route);
        }
      },
    });

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    if (!hasText) {
      return;
    }
    sendMessage({ text: message.text });
    setInput("");
  };
  return (
    <Popover>
      <Button
        size="lg"
        className="fixed right-6 bottom-6 z-50 group h-16 w-16 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        render={<PopoverTrigger />}
      >
        <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
        <X className="group-not-data-popup-open:hidden relative h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-90" />
        <MessageCircle className="group-data-popup-open:hidden relative h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
      </Button>

      <PopoverContent
        className="h-128 w-80 sm:w-96 p-0 rounded-2xl"
        sideOffset={12}
      >
        <div className="flex h-full flex-col ">
          <div className="flex items-center justify-between border-b border-border/50 bg-linear-to-r from-blue-600/10 to-purple-600/10 px-5 py-4 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Asistente AI</h3>
                <p className="text-xs text-muted-foreground">En línea</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-4 py-3">
            <Conversation className="h-full">
              <ConversationContent>
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Message
                              key={`${message.id}-${i}`}
                              from={message.role}
                            >
                              <MessageContent>
                                <MessageResponse>{part.text}</MessageResponse>
                              </MessageContent>
                              {message.role === "assistant" &&
                                i === messages.length - 1 && (
                                  <MessageActions>
                                    <MessageAction
                                      onClick={() => regenerate()}
                                      label="Retry"
                                    >
                                      <RefreshCcwIcon className="size-3" />
                                    </MessageAction>
                                    <MessageAction
                                      onClick={() =>
                                        navigator.clipboard.writeText(part.text)
                                      }
                                      label="Copy"
                                    >
                                      <CopyIcon className="size-3" />
                                    </MessageAction>
                                  </MessageActions>
                                )}
                            </Message>
                          );
                        case "reasoning":
                          return (
                            <Reasoning
                              key={`${message.id}-${i}`}
                              className="w-full"
                              isStreaming={
                                status === "streaming" &&
                                i === message.parts.length - 1 &&
                                message.id === messages.at(-1)?.id
                              }
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                ))}
                {status === "streaming" && <Loader />}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          <div className="border-t border-border/50 bg-muted/30 px-4 py-3 rounded-b-2xl">
            <PromptInput
              onSubmit={handleSubmit}
              globalDrop
              multiple
              className="rounded-xl border-border/50 bg-background shadow-sm transition-shadow duration-200 focus-within:shadow-md"
            >
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  placeholder="Escribe tu mensaje..."
                  className="placeholder:text-muted-foreground/60"
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools />
                <PromptInputSubmit
                  onClick={() => status === "streaming" && stop()}
                  disabled={!input && !status}
                  status={status}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
