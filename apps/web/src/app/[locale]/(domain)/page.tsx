import { setServerLocale } from '@/locales/request'
import HomeContainer from '@/sections/home/home-container'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
	await setServerLocale()

	return {
		title: t`GenderLex | Your smart writing assistant`,
		description: t`GenderLex, your smart writing assistant`,
	}
}

export default async function Home() {
	await setServerLocale()
	return <HomeContainer />
}
