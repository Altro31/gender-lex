import { cookies } from "next/headers"

export default function ThemeRegister() {
	return <Register />
}

async function Register() {
	const cookiesStore = await cookies()
	const isDark = cookiesStore.get("THEME_DARK")
	return <div id="theme" data-dark={isDark?.value === "true" || undefined} />
}
