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
			<div className="bg-input/30 space-y-2 rounded-lg border">
				<RHFTextarea
					name="text"
					placeholder={t("Home.form.text.placeholder")}
					className="max-h-48 min-h-0 rounded-none border-none shadow-none focus-visible:ring-0 dark:bg-transparent"
					rows={1}
				/>
				<div className="bg-background flex justify-between rounded-lg p-2">
					<div className="flex gap-1">
						<UploadButton />
						<RHFSelectAutofetcher
							name="preset"
							fetcherFunc={getPresetsSelect}
							getKey={(i) => i.id}
							getLabel={(i) => i.name}
						/>
					</div>
					<FormSendButton />
				</div>
			</div>
		</>
	)
}
