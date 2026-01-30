import { getApiClient } from "@/lib/api/client";
import { handle } from "@/lib/api/util";
import { AnalysisApp } from "@repo/types/api";
import { tool } from "ai";
import z from "zod";

export const analysisTools = {
  analice: tool({
    description: "Analice a text for bias detection",
    inputSchema: z.object({ text: z.string() }),
  }),
  getAnalysis: tool({
    description: "Get the full information of an analysis",
    inputSchema: z.object({
      id: z.string(),
    }),
    async execute({ id }) {
      const client = getApiClient<AnalysisApp>();
      return handle(client.analysis[":id"].$get({ param: { id } }));
    },
  }),
};
