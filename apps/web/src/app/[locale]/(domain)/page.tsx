import { setServerLocale } from "@/locales/request"
import HomeContainer from "@/sections/home/home-container"

export default async function Home({ params }: PageProps<"/[locale]">) {
	await setServerLocale(params)
	return <HomeContainer />
}
