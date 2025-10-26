import { i18n } from "@lingui/core"
import { setI18n } from "@lingui/react/server"

export async function setServerLocale(params: Promise<{ locale: string }>) {
	const { locale } = await params
	const { messages } = await import(`./langs/${locale}.po`)
	i18n.load(locale, messages)
	i18n.activate(locale)
	setI18n(i18n)
	return i18n
}
