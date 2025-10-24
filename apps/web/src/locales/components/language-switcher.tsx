'use client'

import {
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { sleep } from '@/lib/utils'
import { setLanguage } from '@/services/registers'
import { useLingui } from '@lingui/react/macro'
import { Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter, useSelectedLayoutSegments } from 'next/navigation'
import { useState, useTransition, type MouseEvent } from 'react'
import { toast } from 'sonner'

export default function LanguageSwitcher() {
    const router = useRouter()
    const { t, i18n } = useLingui()
    const locale = i18n.locale
    // const [loading, setLoading] = useState(false)
    const [loading, startTransition] = useTransition()

    // const changeLanguage =
    //     (value: string) => async (e: MouseEvent<HTMLDivElement>) => {
    //         const target = e.currentTarget
    //         if (!loading) {
    //             setLoading(true)
    //             e.preventDefault()
    //             setLanguage(value).then(error => {
    //                 if (error) {
    //                     console.log(error)
    //                     toast.error('Error')
    //                 } else {
    //                     router.refresh()
    //                 }
    //             })
    //             sleep(2000).then(() => target.click())
    //         }
    //     }

    const changeLanguage =
        (value: string) => () => {
            startTransition(async () => {
                const { serverError } = await setLanguage(value)
                if (serverError) {
                    console.log(serverError)
                    toast.error('Error')
                    return
                }
                const url = new URL(window.location.href)
                const segments = url.pathname.split("/")
                segments[1] = value
                url.pathname = segments.join("/")
                router.replace(url.toString())
            })
        }

    return (
        <>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2">
                    {loading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <span className="rounded-sm border px-1">{locale}</span>
                    )}
                    {t`Language`}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <DropdownMenuItem
                        onClick={changeLanguage('en')}
                        data-active={locale === 'en' || loading || undefined}
                        className="data-active:pointer-events-none data-active:opacity-50"
                    >
                        {t`English`}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={changeLanguage('es')}
                        data-active={locale === 'es' || loading || undefined}
                        className="data-active:pointer-events-none data-active:opacity-50"
                    >
                        {t`Spanish`}
                    </DropdownMenuItem>
                </DropdownMenuSubContent>
            </DropdownMenuSub>
        </>
    )
}
