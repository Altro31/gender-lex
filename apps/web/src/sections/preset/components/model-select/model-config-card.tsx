"use client"

import RHFSelect from "@/components/rhf/rhf-select"
import RHFSelectAutofetcher from "@/components/rhf/rhf-select-autofetcher"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PresetSchema } from "@/sections/preset/form/preset-schema"
import { getModelsSelect } from "@/services/model"
import type { $Enums } from "@repo/db/models"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useWatch } from "react-hook-form"

interface Props {
	index: number
	onRemove: () => void
}

const roleOptions = ["primary", "secondary"] as $Enums.ModelRole[]

export default function ModelConfigCard({ index, onRemove }: Props) {
	const t = useTranslations()

	const model = useWatch<PresetSchema>({
		name: `Models.${index}`,
	}) as PresetSchema["Models"][number]

	const getRoleColor = (role: $Enums.ModelRole) => {
		switch (role) {
			case "primary":
				return "border-blue-200 bg-blue-50"
			case "secondary":
				return "border-green-200 bg-green-50"
			default:
				return "border-gray-200 bg-gray-50"
		}
	}

	return (
		<Card
			className={`${getRoleColor(model.role)} transition-colors duration-200`}
		>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between gap-1">
					<div className="flex-1">
						<CardTitle className="text-base">
							{model.Model?.name || t('Preset.form.models.no-set-model')} -{" "}
							{model.role || t('Preset.form.models.no-set-role')}
						</CardTitle>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="hover:text-destructive"
						onClick={onRemove}
					>
						<Trash2 />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Basic Configuration */}
				<div className="flex flex-wrap items-start gap-2">
					<RHFSelectAutofetcher
						name={`Models.${index}.Model`}
						label={t('Model.item')}
						placeholder={t('Preset.form.models.model-select.placeholder')}
						required
						fetcherFunc={getModelsSelect}
						getKey={(item) => item.id}
						getLabel={(item) => item.name}
					/>
					<RHFSelect
						name={`Models.${index}.role`}
						options={roleOptions}
						label={t('Commons.role')}
						placeholder={t('Preset.form.models.role-select')}
						required
					/>
				</div>
			</CardContent>
		</Card>
	)
}
