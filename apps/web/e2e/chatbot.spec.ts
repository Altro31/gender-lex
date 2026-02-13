import { test, expect, type Page } from "@playwright/test";

/**
 * E2E Tests for Gender-Lex AI Chatbot
 *
 * Tests cover:
 * - Chatbot UI visibility and interaction
 * - Message sending and receiving
 * - Streaming responses
 * - Error handling
 * - AI suggestion integration
 */

const TEST_EMAIL = process.env.TEST_EMAIL || "test@example.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "password123";

test.describe("AI Chatbot E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto("/");

    // Wait for page to be ready
    await page.waitForLoadState("networkidle");
  });

  test("should display chatbot interface", async ({ page }) => {
    // Look for common chatbot elements (adjust selectors based on your actual implementation)
    const chatbotButton = page.getByRole("button", {
      name: /chat|asistente|ayuda/i,
    });

    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
    }

    // Wait for chatbot to open
    await page.waitForTimeout(500);

    // Verify chatbot is visible
    const chatInput = page.getByPlaceholder(/escribe|mensaje|pregunta/i);
    await expect(chatInput).toBeVisible();
  });

  test("should send a message and receive AI response", async ({ page }) => {
    // Open chatbot (if needed)
    const chatbotButton = page.getByRole("button", {
      name: /chat|asistente|ayuda/i,
    });
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);
    }

    // Find chat input
    const chatInput = page.getByPlaceholder(/escribe|mensaje|pregunta/i);
    await expect(chatInput).toBeVisible();

    // Type a test message
    const testMessage = "¿Cómo puedo usar Gender-Lex para analizar textos?";
    await chatInput.fill(testMessage);

    // Send message (look for send button or press Enter)
    const sendButton = page.getByRole("button", { name: /enviar|send/i });
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press("Enter");
    }

    // Wait for user message to appear
    await expect(page.getByText(testMessage)).toBeVisible({ timeout: 5000 });

    // Wait for AI response (look for streaming or complete response)
    // Adjust timeout for AI response time
    await page.waitForTimeout(3000);

    // Verify some response appeared (adjust selector based on your UI)
    const messages = page.locator('[role="article"], .message, [data-message]');
    const messageCount = await messages.count();
    expect(messageCount).toBeGreaterThan(1); // At least user message + AI response
  });

  test("should handle streaming responses", async ({ page }) => {
    // Open chatbot
    const chatbotButton = page.getByRole("button", {
      name: /chat|asistente|ayuda/i,
    });
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);
    }

    const chatInput = page.getByPlaceholder(/escribe|mensaje|pregunta/i);
    await chatInput.fill("Explícame qué es el sesgo de género");

    const sendButton = page.getByRole("button", { name: /enviar|send/i });
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press("Enter");
    }

    // Look for loading indicator
    const loadingIndicator = page.locator(
      '[data-loading], .loading, [role="status"]'
    );

    // If streaming, loading should appear and disappear
    if (
      await loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false)
    ) {
      await expect(loadingIndicator).toBeHidden({ timeout: 15000 });
    }

    // Response should be complete
    await page.waitForTimeout(2000);
    const messages = page.locator('[role="article"], .message, [data-message]');
    expect(await messages.count()).toBeGreaterThan(1);
  });

  test("should handle multiple messages in conversation", async ({ page }) => {
    const chatbotButton = page.getByRole("button", {
      name: /chat|asistente|ayuda/i,
    });
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);
    }

    const chatInput = page.getByPlaceholder(/escribe|mensaje|pregunta/i);

    // Send first message
    await chatInput.fill("Hola");
    await chatInput.press("Enter");
    await page.waitForTimeout(2000);

    // Send second message
    await chatInput.fill("¿Qué puedes hacer?");
    await chatInput.press("Enter");
    await page.waitForTimeout(2000);

    // Send third message
    await chatInput.fill("Gracias");
    await chatInput.press("Enter");
    await page.waitForTimeout(2000);

    // Should have at least 6 messages (3 user + 3 AI)
    const messages = page.locator('[role="article"], .message, [data-message]');
    expect(await messages.count()).toBeGreaterThanOrEqual(6);
  });

  test("should provide bias analysis suggestions when asked", async ({
    page,
  }) => {
    const chatbotButton = page.getByRole("button", {
      name: /chat|asistente|ayuda/i,
    });
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);
    }

    const chatInput = page.getByPlaceholder(/escribe|mensaje|pregunta/i);

    // Ask for bias analysis
    const biasQuery =
      "Analiza este texto: El director debe ser un hombre de negocios astuto";
    await chatInput.fill(biasQuery);
    await chatInput.press("Enter");

    // Wait for AI to process and respond
    await page.waitForTimeout(5000);

    // Look for keywords in the response related to bias
    const responseText = await page.textContent("body");

    // Response should mention bias-related terms (adjust based on your AI's responses)
    const hasBiasTerms =
      responseText?.includes("sesgo") ||
      responseText?.includes("género") ||
      responseText?.includes("estereotipo") ||
      responseText?.includes("inclusiv");

    expect(hasBiasTerms).toBeTruthy();
  });

  test("should handle errors gracefully", async ({ page }) => {
    // Intercept API calls and simulate error
    await page.route("**/api/chat/**", (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    const chatbotButton = page.getByRole("button", {
      name: /chat|asistente|ayuda/i,
    });
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);
    }

    const chatInput = page.getByPlaceholder(/escribe|mensaje|pregunta/i);
    await chatInput.fill("Test message");
    await chatInput.press("Enter");

    // Wait and look for error message
    await page.waitForTimeout(2000);

    // Should show some error indication (adjust based on your error handling)
    const errorMessage = page.getByText(/error|problema|intenta/i);
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("should close chatbot when close button is clicked", async ({
    page,
  }) => {
    const chatbotButton = page.getByRole("button", {
      name: /chat|asistente|ayuda/i,
    });
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);
    }

    const chatInput = page.getByPlaceholder(/escribe|mensaje|pregunta/i);
    await expect(chatInput).toBeVisible();

    // Look for close button
    const closeButton = page.getByRole("button", { name: /cerrar|close/i });
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await page.waitForTimeout(500);

      // Chatbot should be closed
      await expect(chatInput).toBeHidden();
    }
  });
});

test.describe("AI Chatbot - Authenticated User", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Attempt login (adjust selectors based on your auth UI)
    const loginButton = page.getByRole("link", {
      name: /iniciar sesión|login|sign in/i,
    });
    if (await loginButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await loginButton.click();
      await page.waitForLoadState("networkidle");

      // Fill login form
      await page.getByLabel(/email|correo/i).fill(TEST_EMAIL);
      await page.getByLabel(/password|contraseña/i).fill(TEST_PASSWORD);
      await page.getByRole("button", { name: /entrar|login|sign in/i }).click();

      // Wait for login to complete
      await page.waitForTimeout(2000);
    }
  });

  test("authenticated user can access chatbot with full features", async ({
    page,
  }) => {
    const chatbotButton = page.getByRole("button", {
      name: /chat|asistente|ayuda/i,
    });
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);
    }

    const chatInput = page.getByPlaceholder(/escribe|mensaje|pregunta/i);
    await expect(chatInput).toBeVisible();

    // Send authenticated query
    await chatInput.fill("¿Cuáles son mis análisis recientes?");
    await chatInput.press("Enter");
    await page.waitForTimeout(3000);

    // Should receive personalized response
    const messages = page.locator('[role="article"], .message, [data-message]');
    expect(await messages.count()).toBeGreaterThan(1);
  });
});
