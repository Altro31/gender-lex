import { getApiClient } from "@/lib/api/client";
import { handle } from "@/lib/api/util";
import { AnalysisApp } from "@repo/types/api";
import { tool } from "ai";
import z from "zod";

export const analysisTools = {
  analice: tool({
    description:
      "Initiates an analysis of a given text to detect potential gender bias and linguistic patterns. This tool starts the analysis process and automatically redirects the user to the analysis results page where they can view the complete results. Use this when the user wants to analyze content for gender bias.",
    inputSchema: z.object({
      text: z
        .string()
        .describe("The text content to be analyzed for gender bias detection"),
    }),
    outputSchema: z
      .string()
      .describe(
        "A simple confirmation message indicating the analysis was successfully initiated. The user will be automatically redirected to view the full analysis results."
      ),
  }),
  getAnalysis: tool({
    description:
      "Retrieves comprehensive information about a previously completed analysis including detected biases, linguistic patterns, confidence scores, and detailed results. Use this when the user wants to review or get details about a specific analysis by its ID.",
    inputSchema: z.object({
      id: z
        .string()
        .describe("The unique identifier (UUID) of the analysis to retrieve"),
    }),
    async execute({ id }) {
      const client = getApiClient<AnalysisApp>();
      return handle(client.analysis[":id"].$get({ param: { id } }));
    },
  }),
  listAnalyses: tool({
    description:
      "Retrieves a paginated list of all analyses created by the user, including their titles, creation dates, status, and basic information. Use this when the user wants to see their analysis history, previous analyses, or browse their past work.",
    inputSchema: z.object({
      page: z
        .number()
        .optional()
        .describe("The page number for pagination (0-indexed)"),
      pageSize: z
        .number()
        .optional()
        .describe("Number of analyses to return per page (default: 10)"),
    }),
    async execute({ page, pageSize }) {
      const client = getApiClient<AnalysisApp>();
      return handle(
        client.analysis.$get({
          query: {
            page: page !== undefined ? page + "" : undefined,
            pageSize: pageSize !== undefined ? pageSize + "" : undefined,
          },
        })
      );
    },
  }),
};
