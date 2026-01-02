import { useParams, useSearchParams } from 'next/navigation'

export function useLocale() {
	const params = useParams()
	return params.locale
}
