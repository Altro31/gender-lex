import ThemeSwitcher from "@/components/theme/theme-switcher"
import { cookies } from "next/headers"

export default async function ThemeContainer() {
	const cookiesStore = await cookies()
	const isDark = cookiesStore.get("THEME_DARK")

	return <ThemeSwitcher isDark={Boolean(isDark?.value)} />
}
