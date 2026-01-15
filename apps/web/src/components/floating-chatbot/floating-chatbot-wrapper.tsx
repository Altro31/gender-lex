"use client";

import { useSession } from "@/lib/auth/auth-client";
import { usePathname } from "next/navigation";

export default function FloatingChatbotWrapper({
  children,
}: React.PropsWithChildren) {
  const { data: session } = useSession();
  const pathname = usePathname().split("/")[2];

  if (pathname === "analysis") return children;
  if (session) return children;
  return null;
}
