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
    description: "Get detailed info for all available routes of the system",
    inputSchema: z.object({}),
    execute: () => availableRoutes,
  }),
  navigateTo: tool({
    description: "Navigate to an specific route",
    inputSchema: z.object({ route: z.enum(Object.keys(availableRoutes)) }),
  }),
};
