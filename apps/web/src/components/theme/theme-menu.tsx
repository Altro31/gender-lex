"use client"

import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { useState, type MouseEvent } from "react"

export default function ThemeSwitcher() {
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
					<Moon className="not-dark:hidden size-4" />
					<Sun className="dark:hidden size-4" />
					Theme
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					<DropdownMenuItem
						onClick={changeTheme(false)}
						className="dark:opacity-50 dark:pointer-events-none"
					>
						<Moon /> Dark
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={changeTheme(true)}
						className="not-dark:opacity-50 not-dark:pointer-events-none"
					>
						<Sun /> Light
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</>
	)
}
