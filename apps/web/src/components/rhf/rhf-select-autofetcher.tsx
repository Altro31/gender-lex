import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import type { ComponentProps } from "react"

interface Props<T> {
	name: string
	label?: string
	required?: boolean
	placeholder?: string
	size?: ComponentProps<typeof SelectTrigger>["size"]
	initialData?: T[]
	fetcherFunc: (params: { page: number }) => Promise<T[]>
	getKey?: (item: T) => string
	getValue?: (item: T) => any
	getLabel?: (item: T) => string
	getDisabled?: (item: T) => boolean
	getGroup?: (item: T) => string
}

export default function RHFSelectAutofetcher<T>({
	name,
	label,
	required,
	placeholder,
	size,
	initialData = [],
	fetcherFunc,
	getKey,
	getLabel,
	getValue,
	getDisabled,
	getGroup,
}: Props<T>) {
	const { data } = useInfiniteQuery({
		initialData: { pageParams: [0], pages: [initialData] },
		queryKey: [name],
		queryFn: ({ pageParam }) => fetcherFunc({ page: pageParam }),
		initialPageParam: 0,
		getNextPageParam: (lastPage: T[], _, lasPageParam) =>
			lastPage.length ? lasPageParam + 1 : undefined,
	})

	const grouped = Object.groupBy(
		data.pages.flat(),
		(item) => getGroup?.(item) ?? "",
	)

	return (
		<FormField
			name={name}
			render={({ field }) => {
				const selectedKey = field.value
					? getKey?.(field.value)
					: field.value
				const selectedLabel = field.value
					? getLabel?.(field.value)
					: field.value
				return (
					<FormItem>
						{label && (
							<FormLabel>
								{label} {required && "*"}
							</FormLabel>
						)}
						<Select
							defaultValue={selectedKey}
							onValueChange={(value) => {
								const selectedItem = Object.values(grouped)
									.filter(Boolean)
									.flat()
									.find((o) => {
										const oKey = getKey?.(o!) ?? o
										return oKey === value
									})
								field.onChange(
									getValue?.(selectedItem!) ?? selectedItem,
								)
							}}
						>
							<FormControl>
								<SelectTrigger size={size}>
									{selectedLabel || placeholder}
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{Object.entries(grouped).map(
									([key, value]) =>
										value && (
											<SelectGroup key={key}>
												{key && (
													<SelectLabel>
														{key}
													</SelectLabel>
												)}
												{value.map((item) => {
													const itemKey =
														getKey?.(item) ?? item

													const itemLabel =
														getLabel?.(item) ?? item
													const itemDisabled =
														getDisabled?.(item) ??
														false

													return (
														<SelectItem
															key={itemKey + ""}
															value={itemKey + ""}
															disabled={
																itemDisabled
															}
														>
															{itemLabel + ""}
														</SelectItem>
													)
												})}
											</SelectGroup>
										),
								)}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)
			}}
		/>
	)
}
