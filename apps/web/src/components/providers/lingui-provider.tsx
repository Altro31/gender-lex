'use client'

import { type Messages, i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'

export function LinguiProvider({
	children,
	initialLocale,
	initialMessages,
}: {
	children: React.ReactNode
	initialLocale: string
	initialMessages: Messages
}) {
	console.log('Locale: ', i18n.locale)
	if (!i18n.locale) {
		i18n.load(initialLocale, initialMessages)
		i18n.activate(initialLocale)
	}

	return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
