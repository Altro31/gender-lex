'use client'

import { authClient } from '@/lib/auth/auth-client'
import { useEffect } from 'react'

interface Props {
	disableOneTapGoogleAction: () => Promise<void>
}

export default function OneTapGoogleTrigger({
	disableOneTapGoogleAction,
}: Props) {
	useEffect(() => {
		authClient.oneTap()
	}, [])

	return null
}
