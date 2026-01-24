"use client";

import { useParams, usePathname } from "next/navigation";
import React, { createContext, use } from "react";
import type { ParamsOf } from "../../.next/dev/types/routes";

const Context = createContext<string | undefined>(undefined);

export default function IsAnalysisProvider({
  children,
}: React.PropsWithChildren) {
  const pathname = usePathname();
  const { id } = useParams<ParamsOf<"/[locale]/analysis/[id]">>();
  const value = pathname.match(/^\/..\/analysis\/.+/) ? id : undefined;
  return <Context value={value}>{children}</Context>;
}

export const useIsAnalysis = () => use(Context);
