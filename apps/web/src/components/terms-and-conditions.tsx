import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import Link from 'next/link'
import { Button } from './ui/button'
import { getLocale } from '@/locales/utils/locale'

export default async function TermsAndConditions() {
	const locale = await getLocale()
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
