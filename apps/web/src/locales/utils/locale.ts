import { locale } from 'next/root-params'

export function getLocale(): Promise<string> {
	return locale()
}
