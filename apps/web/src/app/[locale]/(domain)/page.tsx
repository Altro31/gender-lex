import { setServerLocale } from "@/locales/request"
import HomeContainer from "@/sections/home/home-container"
import { Metadata } from "next"
import { t } from "@lingui/core/macro"

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
	await setServerLocale(params)

	return {
		title: t`GenderLex | Your smart writing assistant`,
		description: t`GenderLex, your smart writing assistant`,
	} as Metadata
}

export default async function Home({ params }: PageProps<"/[locale]">) {
	await setServerLocale(params)
	return <HomeContainer />
}
