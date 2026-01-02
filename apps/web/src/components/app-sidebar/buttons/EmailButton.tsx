'use client'

import LastUsedBadge from '@/components/last-used-badge'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useLastLoginMethod } from '@/lib/auth/auth-client'
import { t } from '@lingui/core/macro'
import { UserIcon } from 'lucide-react'
import Link from 'next/link'

export default function EmailButton() {
	const [method] = useLastLoginMethod()

	return (
		<DropdownMenuItem render={<Link href="/auth/login" />}>
			<UserIcon />
			{t`Email`}
			{method === 'email' && (
				<LastUsedBadge variant="inline" className="ml-auto" />
			)}
		</DropdownMenuItem>
	)
}
