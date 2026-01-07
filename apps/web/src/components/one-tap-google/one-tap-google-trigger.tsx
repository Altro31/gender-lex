"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OneTapGoogleTrigger() {
  const router = useRouter();
  useEffect(() => {
    authClient.oneTap({ fetchOptions: { onSuccess: () => router.refresh() } });
  }, []);

  return null;
}
