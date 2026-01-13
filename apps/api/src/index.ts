import analysis from "@/modules/data/analysis"
import model from "@/modules/data/model"
import sse from "@/modules/sse"
import zen from "@/modules/data/zen"
import { auth } from "@repo/auth/api"
import { Scalar } from "@scalar/hono-api-reference"
import { Hono } from "hono"
import { openAPIRouteHandler } from "hono-openapi"
import { cors } from "hono/cors"
import { effectMiddleware } from "./plugins/effect.plugin"

const app = new Hono()
    // Apply CORS middleware
    .use("*", cors())

app.on(["POST", "GET"], "/api/auth/*", c => {
    return auth.handler(c.req.raw)
})

// Apply Effect middleware
app.use("*", effectMiddleware)

// Mount module routes
const analysisRoute = app.route("/analysis", analysis)
export type AnalysisApp = typeof analysisRoute

const modelRoute = app.route("/model", model)
export type ModelApp = typeof modelRoute

const sseRoute = app.route("/sse", sse)
export type SseApp = typeof sseRoute

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
