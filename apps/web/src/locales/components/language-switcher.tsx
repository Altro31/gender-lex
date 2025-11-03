"use client"

import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { setLanguage } from "@/services/registers"
import { t } from "@lingui/core/macro"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function LanguageSwitcher() {
	const router = useRouter()
	const { locale } = useParams()
	const pathname = usePathname()

	useEffect(() => {
		const targetLocale = locale === "es" ? "en" : "es"
		const newPathname = pathname.split("/").with(1, targetLocale).join("/")
		router.prefetch(newPathname)
	}, [pathname, router])

	const changeLanguage = (value: string) => async () => {
		const { serverError } = await setLanguage(value)
		if (serverError) {
			console.log(serverError)
			toast.error("Error")
			return
		}
		const newPathname = pathname.split("/").with(1, value).join("/")
		router.replace(newPathname)
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
						onClick={changeLanguage("en")}
						data-active={locale === "en" || undefined}
						className="data-active:pointer-events-none data-active:opacity-50"
					>
						{t`English`}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={changeLanguage("es")}
						data-active={locale === "es" || undefined}
						className="data-active:pointer-events-none data-active:opacity-50"
					>
						{t`Spanish`}
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</>
	)
}
