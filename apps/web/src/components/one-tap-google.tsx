"use client";

import { authClient, useSession } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OneTapGoogle() {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session) return;
    authClient.oneTap({ fetchOptions: { onSuccess: () => router.refresh() } });
  }, [session]);

  return null;
}
