"use client";

import { type Messages, i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useLayoutEffect } from "react";

export function LinguiProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode;
  initialLocale: string;
  initialMessages: Messages;
}) {
  i18n.activate(initialLocale);
  useLayoutEffect(() => {
    i18n.load(initialLocale, initialMessages);
    i18n.activate(initialLocale);
  }, [initialLocale]);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
