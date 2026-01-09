# OpenAPI Documentation

This document describes the OpenAPI documentation implemented for the Gender-Lex API.

## Overview

All API routes are now documented using OpenAPI 3.0 specification via the `hono-openapi` library. The documentation is automatically generated from the route definitions and provides:

- **Interactive API Documentation**: Available at `/openapi` (Scalar UI)
- **OpenAPI Specification**: Available at `/openapi/spec` (JSON format)
- **Auto-generated Schemas**: Request/response schemas derived from Zod validation schemas
- **Tag-based Organization**: Endpoints grouped by functionality

## Accessing the Documentation

### Development
```bash
# Start the development server
cd apps/api
bun run dev

# Then visit in your browser:
# - Interactive docs: http://localhost:3000/openapi
# - OpenAPI spec: http://localhost:3000/openapi/spec
```

### Production
```
- Interactive docs: https://gender-lex.onrender.com/openapi
- OpenAPI spec: https://gender-lex.onrender.com/openapi/spec
```

## Documented Endpoints

### Health Check (Tag: Health)

#### `GET /`
- **Summary**: Health check
- **Description**: Check if the API server is running and healthy
- **Response**: `{ ok: true }`

### Analysis Module (Tag: Analysis)

#### `POST /analysis/prepare`
- **Summary**: Prepare and start a new analysis
- **Description**: Upload text or files for gender bias analysis. Initiates an analysis workflow using the specified preset.
- **Request Body** (multipart/form-data):
  - `text` (string, optional): Text content to analyze for gender bias
  - `files` (array of files, optional): Files to analyze (PDF or text documents)
  - `selectedPreset` (string, required): ID of the preset to use for analysis
- **Response**: `{ id: string }` - ID of the created analysis

#### `GET /analysis/status-count`
- **Summary**: Get analysis status counts
- **Description**: Returns the count of analyses grouped by status (pending, processing, completed, failed)
- **Response**: Record of status names to counts

#### `DELETE /analysis/:id`
- **Summary**: Delete an analysis
- **Description**: Permanently delete an analysis by its ID
- **Parameters**:
  - `id` (path, required): ID of the analysis to delete

#### `GET /analysis/:id`
- **Summary**: Stream analysis updates (SSE)
- **Description**: Server-Sent Events endpoint that streams real-time analysis updates
- **Parameters**:
  - `id` (path, required): ID of the analysis to retrieve
- **Response**: SSE stream

#### `GET /analysis`
- **Summary**: List analyses
- **Description**: Retrieve a paginated list of analyses with optional filters
- **Query Parameters**:
  - `q` (string, optional): Search query to filter analyses
  - `page` (integer, optional): Page number for pagination
  - `status` (enum, optional): Filter by analysis status
- **Response**: Paginated list of analyses

#### `POST /analysis/:id/redo`
- **Summary**: Redo an analysis
- **Description**: Restart a completed or failed analysis with the same parameters
- **Parameters**:
  - `id` (path, required): ID of the analysis to redo
- **Response**: `{ id: string }` - ID of the new analysis

### Models Module (Tag: Models)

#### `POST /model`
- **Summary**: Create a new AI model
- **Description**: Register a new AI model configuration for use in analysis
- **Request Body** (application/json):
  - `name` (string, required): Name of the AI model
  - `provider` (string, required): Provider of the model (e.g., OpenAI, Groq)
  - `apiKey` (string, required): API key for the model provider
  - `baseURL` (string, optional): Base URL for the API endpoint
  - `model` (string, required): Model identifier (e.g., gpt-4, llama-3)
- **Response**: `{ ok: true }`

#### `POST /model/:id/test-connection`
- **Summary**: Test model connection
- **Description**: Verify that the model configuration is valid and the API is accessible
- **Parameters**:
  - `id` (path, required): ID of the model to test
- **Response**: `boolean` - True if connection successful

### Chatbot Module (Tag: Chatbot)

🔒 **Authentication Required**: All chatbot endpoints require authentication

#### `POST /chatbot/message`
- **Summary**: Send a message to the chatbot
- **Description**: Send a message and receive an AI-generated response about gender-inclusive language and platform features
- **Request Body** (application/json):
  - `content` (string, required): Message content to send to the chatbot
- **Response**: Object containing both user and bot messages with IDs and timestamps

#### `GET /chatbot/messages`
- **Summary**: Get conversation history
- **Description**: Retrieve all messages from the user's conversation with the chatbot
- **Response**: Array of messages with sender, content, and timestamp

### SSE Module (Tag: SSE)

#### `GET /sse`
- **Summary**: Subscribe to server-sent events
- **Description**: Establish a Server-Sent Events connection for real-time updates about analyses and other activities
- **Response**: SSE stream

### Authentication Module (Tag: Auth)

Authentication endpoints are handled by Better Auth and have their own OpenAPI specification available at:
- `/api/auth/open-api/generate-schema`

## API Information

- **Title**: Gender-Lex API
- **Version**: 1.0.0
- **Description**: API for analyzing gender bias in text and documents. Provides endpoints for document analysis, AI-powered gender bias detection, terminology extraction, and chatbot interactions.

## Servers

- **Local Development**: http://localhost:3000
- **Production**: https://gender-lex.onrender.com

## Implementation Details

### Technology Stack

- **OpenAPI Library**: `hono-openapi` v1.1.2
- **Validation**: Zod schemas with descriptions
- **Documentation UI**: Scalar v0.9.30
- **Additional Sources**: Better Auth OpenAPI integration

### Route Documentation Pattern

Each route is documented using the `validator` function from `hono-openapi`:

```typescript
import { validator } from "hono-openapi"
import z from "zod"

app.post(
  "/example",
  validator(
    "json", // or "query", "param", "form"
    z.object({
      field: z.string().describe("Field description")
    }),
    {
      tags: ["TagName"],
      summary: "Short summary",
      description: "Detailed description",
      responses: {
        200: {
          description: "Success response",
          content: {
            "application/json": {
              schema: z.object({ /* response schema */ })
            }
          }
        }
      }
    }
  ),
  async (c) => { /* handler */ }
)
```

### Tags

Routes are organized into the following tags:
- **Health**: System health and status
- **Analysis**: Document analysis and bias detection
- **Models**: AI model configuration
- **Chatbot**: AI assistant for gender-inclusive language
- **SSE**: Real-time event streaming
- **Auth**: Authentication (separate specification)

## Benefits

1. **Auto-generated Documentation**: Reduces manual documentation maintenance
2. **Type Safety**: Leverages existing Zod schemas for validation and documentation
3. **Interactive Testing**: Scalar UI allows testing endpoints directly
4. **API Discovery**: Clear overview of all available endpoints
5. **Integration Ready**: OpenAPI spec can be used with code generators and API clients
6. **Multi-source Support**: Combines main API docs with Better Auth docs

## Future Enhancements

Potential improvements for the OpenAPI documentation:

1. Add security scheme definitions for Better Auth
2. Include example request/response payloads
3. Add error response schemas (4xx, 5xx)
4. Document webhook events for SSE
5. Add API versioning support
6. Include rate limiting information
7. Add deprecation notices for endpoints
8. Document CORS policies
9. Add authentication flow diagrams
10. Include API usage examples in multiple languages
