import { Card } from "@/components/ui/card"
import RHFUploadArea from "@/sections/home/components/upload/upload-area"
import HomeFormContainer from "@/sections/home/form/home-form-container"
import HomeFormProvider from "@/sections/home/form/home-form-provider"
import { getLastUsedPreset } from "@/services/preset"
import {
	ChartColumnIcon,
	FileTextIcon,
	RefreshCwIcon,
	SearchCodeIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

const cards = [
	{
		icon: SearchCodeIcon,
		text: "Home.card.1",
		ready: true,
	},
	{
		icon: ChartColumnIcon,
		text: "Home.card.2",
		ready: true,
	},
	{
		icon: RefreshCwIcon,
		text: "Home.card.3",
		ready: true,
	},
	{
		icon: FileTextIcon,
		text: "Home.card.4",
		ready: false,
	},
]

export default async function HomeContainer() {
	const t = await getTranslations()
	const preset = await getLastUsedPreset()
	return (
		<HomeFormProvider lastUsedPreset={preset!}>
			<RHFUploadArea className="flex h-full items-center justify-center">
				<div className="max-w-4xl space-y-3 p-4 sm:space-y-8">
					<div className="w-fit">
						<div className="space-y-2">
							<h1 className="from-primary bg-linear-to-r via-fuchsia-600/80 via-65% to-violet-500 to-75% bg-clip-text p-1 text-3xl font-bold text-transparent sm:text-4xl">
								<span>{t("Home.title.1")}</span>
								<br />
								<span className="text-2xl">
									{t("Home.title.2")}
								</span>
							</h1>
						</div>
					</div>
					<div className="flex flex-wrap justify-center gap-4">
						{cards.map(({ icon: Icon, text, ready }) => (
							<Card
								key={text}
								data-ready={ready}
								className="data-[ready=false]:bg-muted hover:bg-muted/80 max-w-34 cursor-pointer p-2 transition-colors sm:max-w-48 sm:p-4"
							>
								<div className="flex h-full justify-between gap-1 sm:flex-col sm:gap-4">
									<span className="text-xs sm:text-sm">
										{t(text)}
									</span>
									<div className="flex flex-col items-end justify-between gap-1 sm:flex-row">
										<Icon className="h-5 w-5 text-gray-500" />
										{!ready && (
											<span className="bg-dev bg rounded-full p-1 px-2 text-sm text-white">
												dev
											</span>
										)}
									</div>
								</div>
							</Card>
						))}
					</div>
					<HomeFormContainer />
				</div>
			</RHFUploadArea>
		</HomeFormProvider>
	)
}
