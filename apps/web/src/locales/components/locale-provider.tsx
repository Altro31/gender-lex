import { NextIntlClientProvider } from "next-intl"
import { Suspense, type PropsWithChildren } from "react"

export default async function LocaleProvider({ children }: PropsWithChildren) {
	return (
		<Suspense
			fallback={
				<NextIntlClientProvider locale="es">
					children
				</NextIntlClientProvider>
			}
		>
			<NextIntlClientProvider>{children}</NextIntlClientProvider>
		</Suspense>
	)
}
