import { routing } from "@/locales/routing"
import createMiddleware from "next-intl/middleware"

export const routingMiddleware = createMiddleware(routing)
