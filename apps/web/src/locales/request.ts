import { i18n } from '@lingui/core'
import { setI18n } from '@lingui/react/server'
import { locale as getLocale } from 'next/root-params'

export async function setServerLocale() {
	let locale: string = await getLocale()
	if (locale.match(/favicon.ico/)) locale = 'en'
	const { messages } = await import(`./langs/${locale}.po`)
	i18n.load(locale, messages)
	i18n.activate(locale)
	setI18n(i18n)
	return i18n
}
