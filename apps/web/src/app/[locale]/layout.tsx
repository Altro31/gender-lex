import config from "@/../lingui.config";
import FloatingChatbot from "@/components/floating-chatbot";
import FloatingChatbotProvider from "@/components/floating-chatbot/floating-chatbot-provider";
import OneTapGoogle from "@/components/one-tap-google";
import { LinguiProvider } from "@/components/providers/lingui-provider";
import QueryProvider from "@/components/providers/query-provider";
import ThemeProvider from "@/components/providers/theme-provider";
import { PushNotificationManager } from "@/components/pwa/push-notification-manager";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/globals.css";
import IsAnalysisProvider from "@/hooks/use-is-analysis";
import { EventSourceProvider } from "@/lib/sse";
import { setServerLocale } from "@/locales/request";
import { NuqsAdapter } from "nuqs/adapters/next";

export function generateStaticParams() {
  return config.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const i18n = await setServerLocale();
  return (
    <html lang={i18n.locale} suppressHydrationWarning>
      <body>
        <div className="root">
          <ThemeProvider>
            <LinguiProvider
              initialLocale={i18n.locale}
              initialMessages={i18n.messages}
            >
              <NuqsAdapter>
                <QueryProvider>
                  <EventSourceProvider>
                    <SidebarProvider>
                      <IsAnalysisProvider>
                        <FloatingChatbotProvider>
                          {children}
                          <PushNotificationManager />
                          <OneTapGoogle />
                          <FloatingChatbot />
                          <Toaster position="bottom-right" />
                        </FloatingChatbotProvider>
                      </IsAnalysisProvider>
                    </SidebarProvider>
                  </EventSourceProvider>
                </QueryProvider>
              </NuqsAdapter>
            </LinguiProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
