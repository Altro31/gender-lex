import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import ModelConfigCard from "@/sections/preset/components/model-select/model-config-card"
import type { PresetSchema } from "@/sections/preset/form/preset-schema"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFieldArray } from "react-hook-form"

export default function RHFModelSelectContainer() {
	const t = useTranslations()
	const { fields, remove, append } = useFieldArray<PresetSchema>({
		name: "Models",
	})
	const models = fields as unknown as PresetSchema["Models"]
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<div className="flex justify-between">
							<CardTitle className="text-lg">
								{t('Preset.form.models.title')}
							</CardTitle>
							<Button
								type="button"
								onClick={() =>
									append({
										role: "" as any,
										Model: "" as any,
									})
								}
								variant="outline"
								size="sm"
							>
								<Plus />
								{t('Model.create.action')}
							</Button>
						</div>
						<CardDescription>
							{t('Preset.form.models.description')}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{!models.length && (
					<div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center">
						<Button
							type="button"
							onClick={() =>
								append({ role: "" as any, Model: "" as any })
							}
							variant="outline"
						>
							<Plus />
							{t('Model.create.empty-action')}
						</Button>
					</div>
				)}
				<div className="space-y-4">
					{models.map((model, index) => (
						<div key={index} className="relative">
							<ModelConfigCard
								index={index}
								onRemove={() => remove(index)}
							/>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
