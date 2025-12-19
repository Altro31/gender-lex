import { cookies } from 'next/headers'
import { Suspense } from 'react'

export default function ThemeRegister() {
	return (
		<Suspense>
			<Register />
		</Suspense>
	)
}

async function Register() {
	const cookiesStore = await cookies()
	const isDark = cookiesStore.get('THEME_DARK')
	return <div id="theme" data-dark={isDark?.value === 'true' || undefined} />
}
