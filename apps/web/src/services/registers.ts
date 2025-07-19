"use server"

import { cookies } from "next/headers"

export async function setTheme(isDark: boolean) {
	const cookiesStore = await cookies()
	cookiesStore.set("THEME_DARK", isDark + "")
}
