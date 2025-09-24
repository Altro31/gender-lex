"use client"

import RHFSelectAutofetcher from "@/components/rhf/rhf-select-autofetcher"
import RHFTextarea from "@/components/rhf/rhf-textarea"
import UploadButton from "@/sections/home/components/upload/upload-button"
import HomeFiles from "@/sections/home/form/home-files"
import FormSendButton from "@/sections/home/form/home-form-send-button"
import { getPresetsSelect } from "@/services/preset"
import { useTranslations } from "next-intl"

export default function HomeFormContainer() {
	const t = useTranslations()
	return (
		<>
			<HomeFiles />
			<div className="space-y-2">
				<RHFTextarea
					name="text"
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
