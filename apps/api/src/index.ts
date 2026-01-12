import analysis from "@/modules/analysis"
import chatbot from "@/modules/chatbot"
import model from "@/modules/model"
import sse from "@/modules/sse"
import zen from "@/modules/zen"
import { auth } from "@repo/auth/api"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { effectMiddleware } from "./plugins/effect.plugin"
import { openAPIRouteHandler } from "hono-openapi"
import { Scalar } from "@scalar/hono-api-reference"

const app = new Hono()

    // Apply CORS middleware
    .use("*", cors())

    .on(["POST", "GET"], "/api/auth/*", c => {
        return auth.handler(c.req.raw)
    })

    // Apply Effect middleware
    .use("*", effectMiddleware)

// Mount module routes
const analysisRoute = app.route("/analysis", analysis)
export type AnalysisApp = typeof analysisRoute

const modelRoute = app.route("/model", model)
export type ModelApp = typeof modelRoute

const sseRoute = app.route("/sse", sse)
export type SseApp = typeof sseRoute

const chatbotRoute = app.route("/chatbot", chatbot)
export type ChatbotApp = typeof chatbotRoute

app.route("/api/crud", zen)

// Health check endpoint
app.get("/", c => {
    return c.json({ ok: true })
})

app.get(
    "/openapi/spec",
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: "Hono API",
                version: "1.0.0",
                description: "Greeting API",
            },
            servers: [
                { url: "http://localhost:3232", description: "Local Server" },
                {
                    url: "https://gender-lex.onrender.com",
                    description: "Production Server",
                },
            ],
        },
    }),
)

app.get(
    "/openapi",
    Scalar({
        hideClientButton: true,
        showDeveloperTools: "always",
        sources: [
            { url: "/openapi/spec", title: "API" },
            { url: "/api/auth/open-api/generate-schema", title: "Auth" },
        ],
    }),
)

export default app
