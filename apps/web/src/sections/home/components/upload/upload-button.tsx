import { Button } from "@/components/ui/button"
import type { HomeSchema } from "@/sections/home/form/home-schema"
import { PaperclipIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ChangeEvent } from "react"
import { useFormContext } from "react-hook-form"

export default function UploadButton() {
	const t = useTranslations()
	const { setValue, getValues } = useFormContext<HomeSchema>()
	const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.currentTarget.files ?? []).map((file) => ({
			file,
		}))
		const previousFiles = getValues("files")
		setValue("files", [...previousFiles, ...files])
		e.currentTarget.value = ""
	}

	return (
		<Button
			asChild
			className="cursor-pointer"
			size="icon"
			variant="outline"
			type="button"
		>
			<label>
				<span className="sr-only">
					{t("Home.form.file.placeholder")}
				</span>
				<PaperclipIcon className="h-4 w-4" />
				<input
					name="file"
					type="file"
					className="hidden"
					accept=".pdf"
					onChange={handleUpload}
				/>
			</label>
		</Button>
	)
}
