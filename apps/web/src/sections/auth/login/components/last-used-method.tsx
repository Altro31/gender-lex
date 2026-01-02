'use client'

import { useLastLoginMethod } from '@/lib/auth/auth-client'
import dynamic from 'next/dynamic'

function Content() {
	const [method] = useLastLoginMethod()

	return (
		<div>
			<p>Last used method: {method ?? 'null'}</p>
		</div>
	)
}

export const LastUsedMethod = dynamic(async () => Content, { ssr: false })
