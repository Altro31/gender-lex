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

export type App = typeof app
const app = new Hono()

    // Apply CORS middleware
    .use("*", cors())

    .on(["POST", "GET"], "/api/auth/*", c => {
        return auth.handler(c.req.raw)
    })

    // Apply Effect middleware
    .use("*", effectMiddleware)

    // Mount module routes
    .route("/analysis", analysis)
    .route("/model", model)
    .route("/sse", sse)
    .route("/chatbot", chatbot)
    .route("/api/crud", zen)

    // Health check endpoint
    .get("/", c => {
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
