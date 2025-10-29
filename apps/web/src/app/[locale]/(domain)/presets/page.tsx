import { setServerLocale } from "@/locales/request"
import PresetsContainer from "@/sections/preset/list/presets-container"
import { t } from "@lingui/core/macro"
import { Metadata } from "next"

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/analysis/[id]">) {
	await setServerLocale(params)

	return {
		title: t`Presets Management` + " | GenderLex",
		description: t`Manage model combinations with specific configurations`,
	} as Metadata
}

export default async function PresetsPage({
	searchParams,
	params,
}: PageProps<"/[locale]/presets">) {
	await setServerLocale(params)

	return <PresetsContainer searchParams={searchParams} />
}
