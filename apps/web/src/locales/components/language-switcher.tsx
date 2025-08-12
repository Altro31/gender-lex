"use client"

import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { setLanguage } from "@/services/registers"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function LanguageSwitcher() {
	const router = useRouter()
	const t = useTranslations()
	const locale = useLocale()
	const [open, setOpen] = useState(false)

	const changeLanguage = (value: string) => async () => {
		const error = await setLanguage(value)
		if (error) {
			console.log(error)
			toast.error("Error")
		} else {
			router.refresh()
		}
	}

	return (
		<>
			<DropdownMenuSub onOpenChange={setOpen} open={open}>
				<DropdownMenuSubTrigger className="gap-2">
					<span className="rounded-sm border px-1">{locale}</span>
					{t("sidebar.language.label")}
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					<DropdownMenuItem
						onClick={changeLanguage("en")}
						data-active={locale === "en" || undefined}
						className="data-active:pointer-events-none data-active:opacity-50"
					>
						{t("Languages.en")}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={changeLanguage("es")}
						data-active={locale === "es" || undefined}
						className="data-active:pointer-events-none data-active:opacity-50"
					>
						{t("Languages.es")}
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</>
	)
}
