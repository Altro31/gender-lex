import FloatingChatbot from "@/components/floating-chatbot";
import { LinguiProvider } from "@/components/providers/lingui-provider";
import QueryProvider from "@/components/providers/query-provider";
import { PushNotificationManager } from "@/components/pwa/push-notification-manager";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/globals.css";
import { EventSourceProvider } from "@/lib/sse";
import { setServerLocale } from "@/locales/request";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Suspense } from "react";
import config from "@/../lingui.config";
import ThemeProvider from "@/components/providers/theme-provider";
import { OneTapGoogle } from "@/components/one-tap-google";

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
                      {children}
                      <PushNotificationManager />
                      <Suspense>
                        <OneTapGoogle />
                      </Suspense>
                      <Suspense>
                        <FloatingChatbot />
                      </Suspense>
                      <Toaster richColors position="bottom-right" />
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
