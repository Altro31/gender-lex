"use client";

import { useSession } from "@/lib/auth/auth-client";
import React from "react";

interface Props {
  children: React.ReactNode | ((session: any) => React.ReactNode);
}

export default function Session({ children }: Props) {
  const { data: session } = useSession();

  return typeof children === "function"
    ? children(session)
    : session && children;
}
