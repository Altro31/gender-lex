'use client'

import LastUsedBadge from '@/components/last-used-badge'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { authClient, useLastLoginMethod } from '@/lib/auth/auth-client'
import { SiGithub } from '@icons-pack/react-simple-icons'

interface Props {
	redirect: string
}

export default function GithubButton({ redirect }: Props) {
	const [method] = useLastLoginMethod()

	return (
		<DropdownMenuItem
			onClick={() => {
				authClient.signIn.social({
					provider: 'github',
					callbackURL: redirect,
				})
			}}
		>
			<SiGithub />
			Github
			{method === 'github' && (
				<LastUsedBadge variant="inline" className="ml-auto" />
			)}
		</DropdownMenuItem>
	)
}
