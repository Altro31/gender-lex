"use client";

import { floatingChatbotPopover } from "@/components/floating-chatbot";
import React, { createContext, use, useState } from "react";

type Context = { key: string | undefined; content?: any };
type ContextType = readonly [
  Context | undefined,
  (context: Context | undefined) => void
];
const Context = createContext<ContextType>([] as any);

export default function FloatingChatbotProvider({
  children,
}: React.PropsWithChildren) {
  const [context, setContext] = useState<Context | undefined>();
  const value = [
    context,
    (context: Context | undefined) => {
      floatingChatbotPopover.open("");
      setContext(context);
    },
  ] as const;
  return <Context value={value}>{children}</Context>;
}

export const useFloatingChatbotContext = () => use(Context);
