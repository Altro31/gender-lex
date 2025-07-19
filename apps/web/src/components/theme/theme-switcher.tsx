"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import type { MouseEvent } from "react"

interface Props {
	isDark: boolean
}

export default function ThemeSwitcher({ isDark }: Props) {
	const toggleTheme = (e: MouseEvent<HTMLButtonElement>) => {
		const target = e.currentTarget as HTMLButtonElement
		const isDark = target.dataset.dark === "true"
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
		<button
			onClick={toggleTheme}
			id="theme"
			data-dark={isDark || undefined}
			className="absolute right-3.5 top-3.5 select-none cursor-pointer z-10"
		>
			<MoonIcon className="hidden in-data-dark:inline" />
			<SunIcon className="in-data-dark:hidden" />
		</button>
	)
}
