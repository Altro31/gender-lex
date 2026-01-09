import analysis from "@/modules/analysis"
import chatbot from "@/modules/chatbot"
import model from "@/modules/model"
import sse from "@/modules/sse"
import zen from "@/modules/zen"
import { auth } from "@repo/auth/api"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { effectMiddleware } from "./plugins/effect.plugin"
import { openAPIRouteHandler, validator } from "hono-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import z from "zod"

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
    .get(
        "/",
        validator(
            "query",
            z.object({}),
            {
                tags: ["Health"],
                summary: "Health check",
                description: "Check if the API server is running and healthy",
                responses: {
                    200: {
                        description: "API is healthy",
                        content: {
                            "application/json": {
                                schema: z.object({
                                    ok: z.literal(true)
                                })
                            }
                        }
                    }
                }
            }
        ),
        c => {
            return c.json({ ok: true })
        }
    )

app.get(
    "/openapi/spec",
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: "Gender-Lex API",
                version: "1.0.0",
                description: "API for analyzing gender bias in text and documents. Provides endpoints for document analysis, AI-powered gender bias detection, terminology extraction, and chatbot interactions.",
            },
            servers: [
                { url: "http://localhost:3000", description: "Local Server" },
                {
                    url: "https://gender-lex.onrender.com",
                    description: "Production Server",
                },
            ],
            tags: [
                {
                    name: "Analysis",
                    description: "Document analysis endpoints for gender bias detection"
                },
                {
                    name: "Models",
                    description: "AI model configuration and management"
                },
                {
                    name: "Chatbot",
                    description: "AI chatbot for gender-inclusive language assistance"
                },
                {
                    name: "SSE",
                    description: "Server-Sent Events for real-time updates"
                },
                {
                    name: "Health",
                    description: "Health check and status endpoints"
                }
            ]
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
