import { setServerLocale } from '@/locales/request'
import LoginContainer from '@/sections/auth/login/login-container'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>) {
	await setServerLocale(params)
	return {
		title: `${t`Login`} | GenderLex`,
		description: t`Login to your account`,
	} as Metadata
}

export default async function LoginPage({
	params,
}: PageProps<'/[locale]/auth/login'>) {
	await setServerLocale(params)
	return <LoginContainer />
}
