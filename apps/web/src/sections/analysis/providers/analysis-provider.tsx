"use client";

import type { Analysis } from "@repo/db/models";
import React, { createContext, use, useEffect, useState } from "react";

type ContextType = [Analysis, (analysis: Analysis | undefined) => void];

const Context = createContext<ContextType>([] as any);

export default function AnalysisProvider({
  children,
}: React.PropsWithChildren) {
  const value = useState<Analysis>();
  return <Context value={value as any}>{children}</Context>;
}

export const useAnalysisContext = () => use(Context);

export function AnalysisRegister({ analysis }: { analysis: Analysis }) {
  const [_, setAnalysis] = useAnalysisContext();
  useEffect(() => {
    setAnalysis(analysis);
  }, [analysis, setAnalysis]);
  return null;
}
