import { setServerLocale } from '@/locales/request'
import RegisterContainer from '@/sections/auth/register/register-container'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>) {
	await setServerLocale(params)

	return {
		title: `${t`Sign up`} | GenderLex`,
		description: t`Register your account`,
	} as Metadata
}

export default async function RegisterPage({
	params,
}: PageProps<'/[locale]/auth/register'>) {
	await setServerLocale(params)
	return <RegisterContainer />
}
