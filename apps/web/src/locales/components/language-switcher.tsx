'use client'

import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { setLanguage } from '@/services/registers'
import { t } from '@lingui/core/macro'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { MouseEventHandler, useEffect } from 'react'
import { toast } from 'sonner'

export default function LanguageSwitcher() {
	const router = useRouter()
	const { locale } = useParams()
	const pathname = usePathname()

	useEffect(() => {
		const targetLocale = locale === 'es' ? 'en' : 'es'
		const newPathname = pathname.split('/').with(1, targetLocale).join('/')
		router.prefetch(newPathname)
	}, [pathname, router])

	const getNewPath = (locale: string) =>
		pathname.split('/').with(1, locale).join('/')

	const changeLanguage = (value: string) => async () => {
		const { serverError } = await setLanguage(value)
		if (serverError) {
			console.log(serverError)
			toast.error('Error')
			return
		}
	}

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
						onClick={changeLanguage('en')}
						disabled={locale === 'en'}
					>
						{t`English`}
					</DropdownMenuItem>
					<DropdownMenuItem
						render={<Link prefetch href={getNewPath('es')} />}
						onClick={changeLanguage('es')}
						disabled={locale === 'es'}
					>
						{t`Spanish`}
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</>
	)
}
