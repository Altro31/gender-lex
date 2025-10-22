import { routing } from "@/locales/routing"
import { hasLocale } from "next-intl"
import { getRequestConfig, setRequestLocale } from "next-intl/server"

export async function setServerLocale(params: Promise<{ locale: string }>) {
	const { locale } = await params
	setRequestLocale(locale)
}

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale
	const locale = hasLocale(routing.locales, requested)
		? requested
		: routing.defaultLocale
	return {
		locale,
		messages: (await import(`./langs/${locale}.json`)).default,
	}
})
