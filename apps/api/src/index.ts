import analysis from "@/modules/analysis"
import chatbot from "@/modules/chatbot"
import model from "@/modules/model"
import sse from "@/modules/sse"
import zen from "@/modules/zen"
import { auth } from "@repo/auth/api"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { authMiddleware } from "./plugins/auth.plugin"
import { effectMiddleware } from "./plugins/effect.plugin"

export type App = typeof app
const app = new Hono()

// Apply CORS middleware
app.use("*", cors())

// Mount better-auth handler
app.route("/api/auth", auth.handler as any)

// Apply Effect middleware
app.use("*", effectMiddleware)

// Mount module routes
app.route("/analysis", analysis)
app.route("/model", model)
app.route("/sse", sse)
app.route("/chatbot", chatbot)
app.route("/api/crud", zen)

// Health check endpoint
app.get("/", (c) => {
    return c.json({ ok: true })
})

export default app
