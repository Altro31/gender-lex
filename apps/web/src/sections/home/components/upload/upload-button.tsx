import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PaperclipIcon } from "lucide-react"
import type { ComponentProps } from "react"

interface Props extends ComponentProps<typeof Button> {
	onFileUpload: (file: File) => void
}

export default function UploadButton({
	onFileUpload,
	className,
	...props
}: Props) {
	return (
		<Button
			asChild
			className={cn("cursor-pointer", className)}
			size="icon"
			variant="outline"
			{...props}
		>
			<label>
				<span className="sr-only">Upload file</span>
				<PaperclipIcon className="h-4 w-4" />
				<input
					name="file"
					type="file"
					className="hidden"
					accept=".pdf"
					onChange={(e) => {
						onFileUpload(e.currentTarget.files?.item(0)!)
					}}
				/>
			</label>
		</Button>
	)
}
