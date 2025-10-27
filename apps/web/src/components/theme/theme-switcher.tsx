'use client'

import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { setTheme } from '@/services/registers'
import { t } from '@lingui/core/macro'
import { Moon, Sun } from 'lucide-react'
import { useState, type MouseEvent } from 'react'

export default function ThemeSwitcher() {
	const [open, setOpen] = useState(false)
	const changeTheme = (isDark: boolean) => async (e: MouseEvent) => {
		const target = document.querySelector<HTMLDivElement>('#theme')
		if (!target) return
		const newValue = !isDark
		if (newValue) {
			target.dataset.dark = newValue + ''
		} else {
			delete target.dataset.dark
		}
		void setTheme(newValue)
	}

	return (
		<DropdownMenuSub onOpenChange={setOpen} open={open}>
			<DropdownMenuSubTrigger className="gap-2">
				<Moon className="size-4 not-dark:hidden" />
				<Sun className="size-4 dark:hidden" />
				{t`Theme`}
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				<DropdownMenuItem
					onClick={changeTheme(false)}
					className="dark:pointer-events-none dark:opacity-50"
				>
					<Moon /> {t`Dark`}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={changeTheme(true)}
					className="not-dark:pointer-events-none not-dark:opacity-50"
				>
					<Sun /> {t`Light`}
				</DropdownMenuItem>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	)
}
