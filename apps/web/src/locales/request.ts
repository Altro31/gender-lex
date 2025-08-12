import { getLocale } from "@/services/auth"
import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async () => {
	const locale = await getLocale()
	return {
		locale,
		messages: (await import(`./langs/${locale}.json`)).default,
	}
})
