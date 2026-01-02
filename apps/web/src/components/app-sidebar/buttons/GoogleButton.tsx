'use client'

import LastUsedBadge from '@/components/last-used-badge'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { authClient, useLastLoginMethod } from '@/lib/auth/auth-client'
import { SiGoogle } from '@icons-pack/react-simple-icons'

interface Props {
	redirect: string
}

export default function GoogleButton({ redirect }: Props) {
	const [method] = useLastLoginMethod()
	return (
		<DropdownMenuItem
			onClick={() => {
				authClient.signIn.social({
					provider: 'google',
					callbackURL: redirect,
				})
			}}
		>
			<SiGoogle />
			Google
			{method === 'google' && (
				<LastUsedBadge variant="inline" className="ml-auto" />
			)}
		</DropdownMenuItem>
	)
}
