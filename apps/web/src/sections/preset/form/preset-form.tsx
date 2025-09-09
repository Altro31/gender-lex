"use client"
import RHFInput from "@/components/rhf/rhf-input"
import RHFTextarea from "@/components/rhf/rhf-textarea"
import RHFModelSelectContainer from "@/sections/preset/components/model-select/rhf-model-select-container"
import { useTranslations } from "next-intl"

export function PresetForm() {
	const t = useTranslations()
	return (
		<div className="space-y-2 p-2">
			<RHFInput
				name="name"
				label={t("Preset.form.name.label")}
				required
				placeholder={t("Preset.form.name.placeholder")}
			/>

			<RHFTextarea
				name="description"
				label={t("Preset.form.description.label")}
				placeholder={t("Preset.form.description.placeholder")}
				rows={3}
			/>
			<RHFModelSelectContainer />
		</div>
	)
}
