'use client'

import LastUsedBadge from '@/components/last-used-badge'
import Loader from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useLastLoginMethod } from '@/lib/auth/auth-client'
import { cn } from '@/lib/utils'
import { signInSocial } from '@/services/auth'
import { SiGoogle, SiGithub } from '@icons-pack/react-simple-icons'
import { t } from '@lingui/core/macro'
import { useAction } from 'next-safe-action/hooks'
import dynamic from 'next/dynamic'
import { useTransition } from 'react'

function SocialLoginButtons() {
	const [method] = useLastLoginMethod()
	const { executeAsync, isPending, input } = useAction(signInSocial)

	const handleSignInSocial = (social: typeof input) => () =>
		executeAsync(social)

	return (
		<>
			<div className="grid grid-cols-2 gap-2">
				<Button
					variant="outline"
					className={cn(
						'h-11 w-full gap-3 bg-transparent hover:bg-muted relative',
						isPending && input === 'google' && 'animate-pulse',
					)}
					onClick={handleSignInSocial('google')}
				>
					{method === 'google' && <LastUsedBadge />}
					{isPending && input === 'google' ? (
						<Loader className="size-5" />
					) : (
						<SiGoogle className="size-5" />
					)}
					{t`Continue with Google`}
				</Button>
				<Button
					variant="outline"
					className={cn(
						'h-11 w-full gap-3 bg-transparent hover:bg-muted relative',
						isPending && input === 'github' && 'animate-pulse',
					)}
					onClick={handleSignInSocial('github')}
				>
					{method === 'github' && <LastUsedBadge />}
					{isPending && input === 'github' ? (
						<Loader className="size-5" />
					) : (
						<SiGithub className="size-5" />
					)}
					{t`Continue with Github`}
				</Button>
			</div>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<Separator className="w-full" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="text-muted-foreground bg-muted px-2">
						{t`Or continue with email`}
					</span>
				</div>
			</div>
		</>
	)
}

export default dynamic(async () => SocialLoginButtons, { ssr: false })
