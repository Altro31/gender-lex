import { Card } from "@/components/ui/card"
import UploadArea from "@/sections/home/components/upload/upload-area"
import HomeFormContainer from "@/sections/home/form/home-form-container"
import {
	ChartColumnIcon,
	FileTextIcon,
	RefreshCwIcon,
	SearchCodeIcon,
} from "lucide-react"

const cards = [
	{
		icon: SearchCodeIcon,
		text: "Analiza texto en busca de contenido sesgado o estigmatizante",
		ready: true,
	},
	{
		icon: ChartColumnIcon,
		text: "Muestra qué términos o expresiones influyen en el contenido redactado",
		ready: true,
	},
	{
		icon: RefreshCwIcon,
		text: "Proporciona alternativas de los términos o expresiones sesgadas",
		ready: true,
	},
	{
		icon: FileTextIcon,
		text: "Pueden subirse archivos en PDF, DOCX...",
		ready: false,
	},
]

export default function HomeContainer() {

	return (
		<UploadArea className="h-full flex items-center justify-center">
			<div className="p-4 max-w-4xl space-y-3 sm:space-y-8">
				<div className="w-fit">
					<div className="space-y-2">
						<h1 className="p-1 text-3xl sm:text-4xl font-bold bg-linear-to-r from-primary via-fuchsia-600/80 via-65% to-75% to-violet-500 bg-clip-text text-transparent">
							<span>Bienvenido/a a GenderLex,</span>
							<br />
							<span className="text-2xl">
								su asistente de escritura inteligente.
							</span>
						</h1>
					</div>
				</div>
				<div className="flex gap-4 flex-wrap justify-center">
					{cards.map(({ icon: Icon, text, ready }) => (
						<Card
							key={text}
							data-ready={ready}
							className="data-[ready=false]:bg-muted  cursor-pointer p-2 sm:p-4 transition-colors hover:bg-muted/80 max-w-34 sm:max-w-48"
						>
							<div className="flex sm:flex-col justify-between h-full gap-1 sm:gap-4">
								<span className="text-xs sm:text-sm">
									{text}
								</span>
								<div className="flex justify-between sm:flex-row flex-col items-end gap-1">
									<Icon className="h-5 w-5 text-gray-500" />
									{!ready && (
										<span className="bg-dev rounded-full bg text-white p-1 px-2 text-sm">
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
		</UploadArea>
	)
}
