import { chatAgent, type ChatbotMessage } from "@/lib/chatbot";
import { convertToModelMessages, UIMessage, type TextPart } from "ai";

export async function POST(request: Request) {
  const {
    messages,
    context,
  }: {
    messages: UIMessage[];
    context?: { key: string; content: unknown; id: string };
  } = await request.json();
  const conversationHistory = await convertToModelMessages(messages);
  if (context) {
    const lastMessages = conversationHistory.at(-1)?.content as TextPart[];
    const message = lastMessages[0]!;
    console.log(conversationHistory);

    message.text =
      `
    <context>
      ${JSON.stringify(context)}
    </context>
    ` + message.text;
  }

  const result = await chatAgent.stream({ messages: conversationHistory });
  return result.toUIMessageStreamResponse<ChatbotMessage>({
    messageMetadata({ part }) {
      if (part.type === "start") {
        return {
          context: context && { key: context?.key },
        };
      }
    },
    onFinish: ({ messages }) => {
      console.log(JSON.stringify(messages, null, "\t"));
    },
  });
}
