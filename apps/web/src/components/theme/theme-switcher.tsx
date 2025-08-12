"use client"

import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, type MouseEvent } from "react"

export default function ThemeSwitcher() {
	const t = useTranslations()
	console.log(t("Commons.more"))
	const [open, setOpen] = useState(false)
	const changeTheme = (isDark: boolean) => async (e: MouseEvent) => {
		const target = document.querySelector<HTMLDivElement>("#theme")
		if (!target) return
		const newValue = !isDark
		if (newValue) {
			target.dataset.dark = newValue + ""
		} else {
			delete target.dataset.dark
		}
		void fetch("/api/register/theme", {
			method: "POST",
			body: JSON.stringify({
				isDark: newValue,
			}),
		})
	}

	return (
		<>
			<DropdownMenuSub onOpenChange={setOpen} open={open}>
				<DropdownMenuSubTrigger className="gap-2">
					<Moon className="size-4 not-dark:hidden" />
					<Sun className="size-4 dark:hidden" />
					{t("sidebar.theme.label")}
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					<DropdownMenuItem
						onClick={changeTheme(false)}
						className="dark:pointer-events-none dark:opacity-50"
					>
						<Moon /> {t("sidebar.theme.dark")}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={changeTheme(true)}
						className="not-dark:pointer-events-none not-dark:opacity-50"
					>
						<Sun /> {t("sidebar.theme.ligth")}
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</>
	)
}
