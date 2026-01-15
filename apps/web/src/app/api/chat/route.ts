import { chatAgent } from "@/lib/chatbot";
import { convertToModelMessages, UIMessage } from "ai";

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[]; message: any } =
    await request.json();
  const conversationHistory = await convertToModelMessages(messages);
  const result = await chatAgent.stream({ messages: conversationHistory });
  return result.toUIMessageStreamResponse({
    onFinish: ({ messages }) => {
      // console.log(JSON.stringify(messages));
    },
  });
}
