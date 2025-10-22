import { setServerLocale } from "@/locales/request"
import { routing } from "@/locales/routing"

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
	params,
	children,
}: LayoutProps<"/[locale]">) {
	await setServerLocale(params)
	return children
}
