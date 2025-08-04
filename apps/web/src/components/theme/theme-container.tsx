import ThemeSwitcher from "@/components/theme/theme-switcher"
import { cookies } from "next/headers"
import { Suspense } from "react"

export default function ThemeContainer() {
	return (
		<Suspense>
			<Theme />
		</Suspense>
	)
}

async function Theme() {
	const cookiesStore = await cookies()
	const isDark = cookiesStore.get("THEME_DARK")

	return <ThemeSwitcher isDark={isDark?.value === "true"} />
}
