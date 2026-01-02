import { locale } from 'next/root-params'
import 'server-only'

export function getLocale(): Promise<string> {
	return locale()
}
