import { setServerLocale } from '@/locales/request'
import RegisterContainer from '@/sections/auth/register/register-container'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'

export async function generateMetadata() {
	await setServerLocale()

	return {
		title: `${t`Sign up`} | GenderLex`,
		description: t`Register your account`,
	} as Metadata
}

export default async function RegisterPage() {
	await setServerLocale()
	return <RegisterContainer />
}
