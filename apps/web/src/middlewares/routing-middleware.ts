import { type NextRequest, NextResponse } from "next/server"

import Negotiator from "negotiator"
import linguiConfig from "../../lingui.config"

const { locales } = linguiConfig

export function routingMiddleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	const pathnameHasLocale = locales.some(
		(locale) =>
			pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	)
	if (pathnameHasLocale) return

	// Redirect if there is no locale
	const locale = getRequestLocale(request.headers)
	request.nextUrl.pathname = `/${locale}${pathname}`
	// e.g. incoming request is /products
	// The new URL is now /en/products
	return NextResponse.redirect(request.nextUrl)
}

function getRequestLocale(requestHeaders: Headers): string {
	const langHeader = requestHeaders.get("accept-language") || undefined
	const languages = new Negotiator({
		headers: { "accept-language": langHeader },
	}).languages(locales.slice())

	const activeLocale = languages[0] || locales[0] || "en"

	return activeLocale
}
