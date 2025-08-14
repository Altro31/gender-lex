"use client"

import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { sleep } from "@/lib/utils"
import { setLanguage } from "@/services/registers"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState, type MouseEvent } from "react"
import { toast } from "sonner"

export default function LanguageSwitcher() {
	const router = useRouter()
	const t = useTranslations()
	const locale = useLocale()
	const [loading, setLoading] = useState(false)

	const changeLanguage =
		(value: string) => async (e: MouseEvent<HTMLDivElement>) => {
			const target = e.currentTarget
			if (!loading) {
				setLoading(true)
				e.preventDefault()
				setLanguage(value).then((error) => {
					if (error) {
						console.log(error)
						toast.error("Error")
					} else {
						router.refresh()
					}
				})
				sleep(2000).then(() => target.click())
			}
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
					{t("sidebar.language.label")}
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					<DropdownMenuItem
						onClick={changeLanguage("en")}
						data-active={locale === "en" || loading || undefined}
						className="data-active:pointer-events-none data-active:opacity-50"
					>
						{t("Languages.en")}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={changeLanguage("es")}
						data-active={locale === "es" || loading || undefined}
						className="data-active:pointer-events-none data-active:opacity-50"
					>
						{t("Languages.es")}
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</>
	)
}
