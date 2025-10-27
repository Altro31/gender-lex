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
import { t } from "@lingui/core/macro"
import { Plus } from "lucide-react"
import { useFieldArray } from "react-hook-form"

export default function RHFModelSelectContainer() {
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
								{t`Model Configuration`}
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
								{t`New model`}
							</Button>
						</div>
						<CardDescription>
							{t`Add and configure the models that will be part of this preset`}
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
							{t`Create First Model`}
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
