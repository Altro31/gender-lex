'use client'

import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { t } from '@lingui/core/macro'
import { LaptopMinimal, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

export default function ThemeSwitcher() {
	const [open, setOpen] = useState(false)
	const { theme, setTheme } = useTheme()

	const handleTheme = (theme: 'dark' | 'ligth' | 'system') => () =>
		setTheme(theme)

	return (
		<DropdownMenuSub onOpenChange={setOpen} open={open}>
			<DropdownMenuSubTrigger className="gap-2">
				{theme === 'dark' && <Moon />}
				{theme === 'ligth' && <Sun />}
				{theme === 'system' && <LaptopMinimal />}
				{t`Theme`}
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				<DropdownMenuItem
					onClick={handleTheme('system')}
					disabled={theme === 'system'}
				>
					<LaptopMinimal /> {t`System`}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={handleTheme('dark')}
					disabled={theme === 'dark'}
				>
					<Moon /> {t`Dark`}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={handleTheme('ligth')}
					disabled={theme === 'ligth'}
				>
					<Sun /> {t`Light`}
				</DropdownMenuItem>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	)
}
