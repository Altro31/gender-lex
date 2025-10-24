import { getI18nInstance } from "./instance"
import { setI18n } from "@lingui/react/server"

export async function setServerLocale(params: Promise<{ locale: string }>) {
	const { locale } = await params
	const i18n = getI18nInstance(locale)
	i18n.activate(i18n.locale)
	setI18n(i18n)
	return i18n
}
