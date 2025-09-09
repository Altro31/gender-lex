import SearchInput from "@/components/search-input"
import { Button } from "@/components/ui/button"
import CreatePresetDialog from "@/sections/preset/components/dialogs/create-preset-dialog"
import PresetListItem from "@/sections/preset/list/preset-list-item"
import type { PresetsResponse } from "@/types/preset"
import { Plus, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

interface Props {
	presets: PresetsResponse
	q?: string
}

export default function PresetsListContainer({ presets, q }: Props) {
	const t = useTranslations()
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						{t("Preset.list.title")}
					</h1>
					<p className="text-gray-600">
						{t("Preset.list.description")}
					</p>
				</div>

				{/* Actions Bar */}
				<div className="mb-6 flex flex-col gap-4 lg:flex-row">
					<SearchInput name="q" className="flex-1" />
					<CreatePresetDialog>
						<Button>
							<Plus />
							{t("Preset.create.action")}
						</Button>
					</CreatePresetDialog>
				</div>

				{/* Presets Grid */}
				{presets.length === 0 ? (
					<div className="py-12 text-center">
						<div className="mb-4 text-gray-400">
							<Zap className="mx-auto h-16 w-16" />
						</div>
						<h3 className="mb-2 text-lg font-medium text-gray-900">
							{q
								? t("Preset.list.no-result-title")
								: t("Preset.list.empty-title")}
						</h3>
						<p className="mb-4 text-gray-600">
							{q
								? t("Preset.list.no-result-description")
								: t("Preset.list.empty-description")}
						</p>
						{!q && (
							<CreatePresetDialog>
								<Button>
									<Plus />
									{t("Preset.create.empty-action")}
								</Button>
							</CreatePresetDialog>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
						{presets.map((preset) => (
							<PresetListItem key={preset.id} preset={preset} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}
