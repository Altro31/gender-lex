'use client'

import { useLocale } from '@/hooks/use-locale'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import Link from 'next/link'
import { Button } from './ui/button'

export default function TermsAndConditions() {
	const locale = useLocale()
	return (
		<p>
			<Trans>
				By continuing, you accept our{' '}
				<Button
					size="xs"
					variant="link"
					nativeButton={false}
					className="p-0"
					render={<Link href={`/${locale}/terms`} />}
				>
					{t`Terms of service`}
				</Button>{' '}
				and{' '}
				<Button
					size="xs"
					variant="link"
					nativeButton={false}
					className="p-0"
					render={<Link href={`/${locale}/privacy`} />}
				>
					{t`Privacy Policy`}
				</Button>
			</Trans>
		</p>
	)
}
