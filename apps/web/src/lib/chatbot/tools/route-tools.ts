import { InferUITools, tool, UIDataTypes, UIMessage } from "ai";
import z from "zod";

export const availableRoutes = {
  "/": "Página principal donde se ejecutan los análisis",
  "/auth/login": "Página de login",
  "/auth/register": "Página de registro de usuario",
  "/models": "Página de administración de modelos",
  "/analysis": "Página de administración de análisi previos del usuario",
  "/presets": "Página de administración de presets",
} as const;

export const routeTools = {
  getAvailableRoutes: tool({
    description:
      "Returns a complete map of all available routes in the application with descriptions of their purpose. Use this when the user asks about available pages, navigation options, or where they can perform specific actions in the system.",
    inputSchema: z.object({}),
    execute: () => availableRoutes,
  }),
  navigateTo: tool({
    description:
      "Navigates the user to a specific page within the application. Use this when the user explicitly requests to go to a particular section (e.g., 'take me to models page', 'go to analysis', 'show me my previous analyses'). Only use routes from the available routes list.",
    inputSchema: z.object({
      route: z
        .enum(Object.keys(availableRoutes))
        .describe(
          "The target route path to navigate to. Must be one of the available routes in the system."
        ),
    }),
  }),
};
