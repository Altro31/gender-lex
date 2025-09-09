"use client"

import RHFSelectAutofetcher from "@/components/rhf/rhf-select-autofetcher"
import RHFTextarea from "@/components/rhf/rhf-textarea"
import UploadButton from "@/sections/home/components/upload/upload-button"
import HomeFiles from "@/sections/home/form/home-files"
import FormSendButton from "@/sections/home/form/home-form-send-button"
import type { HomeSchema } from "@/sections/home/form/home-schema"
import { getPresetsSelect } from "@/services/preset"
import { useTranslations } from "next-intl"
import { useWatch } from "react-hook-form"

export default function HomeFormContainer() {
	const t = useTranslations()
	const [files] = useWatch<HomeSchema>({ name: ["files"] })
	return (
		<>
			<HomeFiles />
			<div className="space-y-2">
				<RHFTextarea
					name="text"
					disabled={!!(files as Array<any>).length}
					placeholder={t("Home.form.text.placeholder")}
				/>
				<div className="flex justify-between">
					<RHFSelectAutofetcher
						name="preset"
						fetcherFunc={getPresetsSelect}
						getKey={(i) => i.id}
						getLabel={(i) => i.name}
					/>
					<div className="flex gap-1">
						<FormSendButton />
						<UploadButton />
					</div>
				</div>
			</div>
		</>
	)
}
