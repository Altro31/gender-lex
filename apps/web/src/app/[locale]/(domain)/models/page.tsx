import { setServerLocale } from "@/locales/request"
import ModelsContainer from "@/sections/model/list/models-container"
import { t } from "@lingui/core/macro"
import { Metadata } from "next"

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/analysis/[id]">) {
	await setServerLocale(params)

	return {
		title: t`Models management` + " | GenderLex",
		description: t`Manage your connections to large language models`,
	} as Metadata
}

export default async function ModelsPage({
	searchParams,
	params,
}: PageProps<"/[locale]/models">) {
	await setServerLocale(params)

	return <ModelsContainer searchParams={searchParams} />
}
