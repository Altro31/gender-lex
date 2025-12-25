'use client'

import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { t } from '@lingui/core/macro'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
	const { locale } = useParams()
	const pathname = usePathname()

	const getNewPath = (locale: string) =>
		pathname.split('/').with(1, locale).join('/')

	return (
		<>
			<DropdownMenuSub>
				<DropdownMenuSubTrigger className="gap-2">
					<span className="rounded-sm border px-1">{locale}</span>
					{t`Language`}
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					<DropdownMenuItem
						render={<Link prefetch href={getNewPath('en')} />}
						disabled={locale === 'en'}
					>
						{t`English`}
					</DropdownMenuItem>
					<DropdownMenuItem
						render={<Link prefetch href={getNewPath('es')} />}
						disabled={locale === 'es'}
					>
						{t`Spanish`}
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</>
	)
}
