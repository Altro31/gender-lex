import { Card } from "@/components/ui/card"
import { UploadArea } from "@/sections/home/components/upload/upload-area"
import HomeForm from "@/sections/home/form/home-form"
import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
import {
	ChartColumnIcon,
	FileTextIcon,
	RefreshCwIcon,
	SearchCodeIcon,
} from "lucide-react"
import { Suspense } from "react"

export default async function HomeContainer() {
	const cards = [
		{
			icon: SearchCodeIcon,
			text: t`Analyze text in search of biased or stigmatizing content`,
			ready: true,
		},
		{
			icon: ChartColumnIcon,
			text: t`Show what terms or expressions influence the written content`,
			ready: true,
		},
		{
			icon: RefreshCwIcon,
			text: t`Provides alternatives of biased terms or expressions`,
			ready: true,
		},
		{
			icon: FileTextIcon,
			text: t`Files can be uploaded in PDF, Docx ...`,
			ready: false,
		},
	]

	return (
		<UploadArea className="flex h-full items-center justify-center">
			<div className="max-w-4xl space-y-3 p-4 sm:space-y-8">
				<div className="w-fit">
					<div className="space-y-2">
						<h1 className="from-primary bg-linear-to-r via-fuchsia-600/80 via-65% to-violet-500 to-75% bg-clip-text p-1 text-3xl font-bold text-transparent sm:text-4xl">
							<Trans>
								<span>Welcome to Genderlex,</span>
								<br />
								<span className="text-2xl">
									your smart writing assistant.
								</span>
							</Trans>
						</h1>
					</div>
				</div>
				<div className="flex flex-wrap justify-center gap-4">
					{cards.map(({ icon: Icon, text, ready }) => (
						<Card
							key={text}
							data-ready={ready}
							className="data-[ready=false]:bg-muted hover:bg-muted/80 max-w-34 p-2 transition-colors sm:max-w-48 sm:p-4"
						>
							<div className="flex h-full justify-between gap-1 sm:flex-col sm:gap-4">
								<span className="text-xs sm:text-sm">
									{text}
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
				<Suspense>
					<HomeForm />
				</Suspense>
			</div>
		</UploadArea>
	)
}
