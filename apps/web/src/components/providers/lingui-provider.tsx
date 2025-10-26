'use client'

import { I18n, type Messages, i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { useEffect, useEffectEvent, useState } from 'react'

export function LinguiProvider({
	children,
	initialLocale,
	initialMessages,
}: {
	children: React.ReactNode
	initialLocale: string
	initialMessages: Messages
}) {
	const [instance, setInstance] = useState<I18n>(i18n)
	const setupI18n = useEffectEvent(() => {
		i18n.load(initialLocale, initialMessages)
		i18n.activate(initialLocale)
		return i18n
	})
	useEffect(() => {
		const instance = setupI18n()
		setInstance(instance)
	}, [setInstance])
	return <I18nProvider i18n={instance}>{children}</I18nProvider>
}
