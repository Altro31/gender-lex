'use client'
import { ThemeProvider as BaseThemeProvider } from 'next-themes'

export default function ThemeProvider(props: React.PropsWithChildren) {
	return (
		<BaseThemeProvider
			{...props}
			attribute="class"
			enableSystem
			disableTransitionOnChange
		/>
	)
}
