import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import FloatingChatbot from "@/components/floating-chatbot";
import FloatingChatbotProvider from "@/components/floating-chatbot/floating-chatbot-provider";
import OneTapGoogle from "@/components/one-tap-google";
import { LinguiProvider } from "@/components/providers/lingui-provider";
import QueryProvider from "@/components/providers/query-provider";
import ThemeProvider from "@/components/providers/theme-provider";
import { PushNotificationManager } from "@/components/pwa/push-notification-manager";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import IsAnalysisProvider from "@/hooks/use-is-analysis";
import { EventSourceProvider } from "@/lib/sse";
import "@/globals.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>GenderLex</title>
      </head>
      <body>
        <div className="root">
          <ThemeProvider>
            <LinguiProvider initialLocale="es" initialMessages={{}}>
              <QueryProvider>
                <EventSourceProvider>
                  <SidebarProvider>
                    <IsAnalysisProvider>
                      <FloatingChatbotProvider>
                        <Outlet />
                        <PushNotificationManager />
                        <OneTapGoogle />
                        <FloatingChatbot />
                        <Toaster position="bottom-right" />
                      </FloatingChatbotProvider>
                    </IsAnalysisProvider>
                  </SidebarProvider>
                </EventSourceProvider>
              </QueryProvider>
            </LinguiProvider>
          </ThemeProvider>
        </div>
        <TanStackRouterDevtools position="bottom-right" />
      </body>
    </html>
  );
}
