import { Button } from "@/components/ui/button"
import { HomeSchema } from "@/sections/home/form/home-schema"
import { Paperclip, X } from "lucide-react"
import { useFieldArray, type FieldArrayWithId } from "react-hook-form"

export default function HomeFiles() {
	const { fields, remove } = useFieldArray<HomeSchema>({
		name: "files",
	})
	const files = fields as unknown as (HomeSchema["files"][number] &
		FieldArrayWithId<{}>)[]
	return (
		files.length > 0 && (
			<div className="mb-3 flex flex-wrap gap-2">
				{files.map((file, index) => (
					<div
						key={file.id}
						className="bg-muted flex items-center gap-2 rounded-md px-3 py-1 text-sm"
					>
						<Paperclip className="h-3 w-3" />
						<span className="max-w-32 truncate">
							{file.file.name}
						</span>
						<Button
							variant="ghost"
							size="icon"
							className="hover:text-destructive size-6 transition-colors hover:bg-red-300"
							onClick={() => remove(index)}
						>
							<X className="h-3 w-3" />
						</Button>
					</div>
				))}
			</div>
		)
	)
}
