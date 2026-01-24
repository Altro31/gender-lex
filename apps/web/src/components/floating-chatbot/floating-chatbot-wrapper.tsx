"use client";

import { useSession } from "@/lib/auth/auth-client";
import { usePathname } from "next/navigation";

export default function FloatingChatbotWrapper({
  children,
}: React.PropsWithChildren) {
  const { data: session } = useSession();
  const parts = usePathname().split("/");
  const isAnalysis = parts[2] === "analysis";
  // If path is /analysis/[id], always shows the chatbot
  if (isAnalysis && parts.length > 2) return children;

  // Other paths shows if authenticated
  if (session) return children;

  return null;
}
