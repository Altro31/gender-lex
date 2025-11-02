import { cookies } from "next/headers"

export async function serializedCookies() {
	const cookiesStore = await cookies()
	return cookiesStore.toString()
}

export async function getHeaders(cookies: string) {
	const headersInstance = new Headers()
	headersInstance.set("cookie", cookies)
	return Object.fromEntries(headersInstance.entries())
}
