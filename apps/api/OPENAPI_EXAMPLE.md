# OpenAPI Specification Example

This file shows an example of what the generated OpenAPI specification looks like for the Gender-Lex API.

## Sample OpenAPI Specification (Partial)

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Gender-Lex API",
    "version": "1.0.0",
    "description": "API for analyzing gender bias in text and documents. Provides endpoints for document analysis, AI-powered gender bias detection, terminology extraction, and chatbot interactions."
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Local Server"
    },
    {
      "url": "https://gender-lex.onrender.com",
      "description": "Production Server"
    }
  ],
  "tags": [
    {
      "name": "Analysis",
      "description": "Document analysis endpoints for gender bias detection"
    },
    {
      "name": "Models",
      "description": "AI model configuration and management"
    },
    {
      "name": "Chatbot",
      "description": "AI chatbot for gender-inclusive language assistance"
    },
    {
      "name": "SSE",
      "description": "Server-Sent Events for real-time updates"
    },
    {
      "name": "Health",
      "description": "Health check and status endpoints"
    }
  ],
  "paths": {
    "/": {
      "get": {
        "tags": ["Health"],
        "summary": "Health check",
        "description": "Check if the API server is running and healthy",
        "responses": {
          "200": {
            "description": "API is healthy",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "ok": {
                      "type": "boolean",
                      "enum": [true]
                    }
                  },
                  "required": ["ok"]
                }
              }
            }
          }
        }
      }
    },
    "/analysis/prepare": {
      "post": {
        "tags": ["Analysis"],
        "summary": "Prepare and start a new analysis",
        "description": "Upload text or files for gender bias analysis. Initiates an analysis workflow using the specified preset.",
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "text": {
                    "type": "string",
                    "description": "Text content to analyze for gender bias"
                  },
                  "files": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "format": "binary"
                    },
                    "description": "Files to analyze (PDF or text documents)"
                  },
                  "selectedPreset": {
                    "type": "string",
                    "description": "ID of the preset to use for analysis"
                  }
                },
                "required": ["selectedPreset"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Analysis successfully initiated",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "ID of the created analysis"
                    }
                  },
                  "required": ["id"]
                }
              }
            }
          }
        }
      }
    },
    "/analysis": {
      "get": {
        "tags": ["Analysis"],
        "summary": "List analyses",
        "description": "Retrieve a paginated list of analyses with optional filters",
        "parameters": [
          {
            "name": "q",
            "in": "query",
            "description": "Search query to filter analyses",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number for pagination",
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "status",
            "in": "query",
            "description": "Filter by analysis status",
            "schema": {
              "type": "string",
              "enum": ["pending", "processing", "completed", "failed"]
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of analyses retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "description": "Array of analysis objects with id, status, createdAt, and other analysis details",
                      "items": {}
                    },
                    "pagination": {
                      "type": "object",
                      "properties": {
                        "page": {
                          "type": "number"
                        },
                        "totalPages": {
                          "type": "number"
                        },
                        "totalItems": {
                          "type": "number"
                        }
                      },
                      "required": ["page", "totalPages", "totalItems"]
                    }
                  },
                  "required": ["data", "pagination"]
                }
              }
            }
          }
        }
      }
    },
    "/model": {
      "post": {
        "tags": ["Models"],
        "summary": "Create a new AI model",
        "description": "Register a new AI model configuration for use in analysis",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Name of the AI model"
                  },
                  "provider": {
                    "type": "string",
                    "description": "Provider of the model (e.g., OpenAI, Groq)"
                  },
                  "apiKey": {
                    "type": "string",
                    "description": "API key for the model provider"
                  },
                  "baseURL": {
                    "type": "string",
                    "description": "Base URL for the API endpoint"
                  },
                  "model": {
                    "type": "string",
                    "description": "Model identifier (e.g., gpt-4, llama-3)"
                  }
                },
                "required": ["name", "provider", "apiKey", "model"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Model created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "ok": {
                      "type": "boolean",
                      "enum": [true]
                    }
                  },
                  "required": ["ok"]
                }
              }
            }
          }
        }
      }
    },
    "/chatbot/message": {
      "post": {
        "tags": ["Chatbot"],
        "summary": "Send a message to the chatbot",
        "description": "Send a message and receive an AI-generated response about gender-inclusive language and platform features",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "content": {
                    "type": "string",
                    "description": "Message content to send to the chatbot"
                  }
                },
                "required": ["content"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Message sent and response received",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "userMessage": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string" },
                        "content": { "type": "string" },
                        "sender": { "type": "string" },
                        "createdAt": { "type": "string" }
                      }
                    },
                    "botMessage": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string" },
                        "content": { "type": "string" },
                        "sender": { "type": "string" },
                        "createdAt": { "type": "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## How to View the Documentation

### Interactive Documentation (Scalar UI)

Visit `http://localhost:3000/openapi` to access the interactive documentation interface. The Scalar UI provides:

- **Browse by Tags**: Endpoints are organized by functionality (Analysis, Models, Chatbot, SSE, Health)
- **Request Builder**: Test endpoints directly from the browser
- **Schema Viewer**: Explore request and response schemas
- **Code Examples**: See how to call endpoints in various languages
- **Authentication**: Configure authentication for protected endpoints

### JSON Specification

Visit `http://localhost:3000/openapi/spec` to get the raw OpenAPI specification in JSON format. This can be:

- Imported into tools like Postman or Insomnia
- Used with code generators (openapi-generator, swagger-codegen)
- Shared with frontend developers for API integration
- Used with API testing tools

## Key Features

1. **Type-Safe Documentation**: Generated from Zod schemas, ensuring docs match implementation
2. **Automatic Updates**: Changes to route definitions automatically update the documentation
3. **Interactive Testing**: Test endpoints without writing code
4. **Multiple Sources**: Combines main API docs with Better Auth documentation
5. **Standard Format**: Uses OpenAPI 3.0 standard for maximum compatibility
