import { i18n } from '@lingui/core'
import { setI18n } from '@lingui/react/server'
import { getLocale } from './utils/locale'

export async function setServerLocale() {
	let locale = await getLocale()
	if (!locale.match(/en|es/)) locale = 'en'
	const { messages } = await import(`./langs/${locale}.po`)
	i18n.load(locale, messages)
	i18n.activate(locale)
	setI18n(i18n)
	return i18n
}
