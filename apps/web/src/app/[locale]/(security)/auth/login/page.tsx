import { setServerLocale } from '@/locales/request'
import LoginContainer from '@/sections/auth/login/login-container'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
	await setServerLocale()
	return {
		title: `${t`Login`} | GenderLex`,
		description: t`Login to your account`,
	}
}

export default async function LoginPage() {
	await setServerLocale()
	return <LoginContainer />
}
