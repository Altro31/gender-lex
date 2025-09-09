"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { type ComponentProps } from "react"

interface Props extends Omit<ComponentProps<"div">, "children"> {
	name: string
}

export default function SearchInput({ name, className, ...props }: Props) {
	const [searchTerm, setSearchTerm] = useQueryState(
		name,
		parseAsString.withDefault("").withOptions({
			shallow: false,
			limitUrlUpdates: { method: "debounce", timeMs: 1000 },
		}),
	)
	return (
		<div className={cn(className, "relative")} {...props}>
			<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
			<Input
				value={searchTerm}
				placeholder="Buscar modelos..."
				className="pl-10"
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
		</div>
	)
}
