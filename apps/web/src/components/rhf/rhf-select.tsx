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
import type { ComponentProps } from "react"

interface Props<T> {
	name: string
	label?: string
	required?: boolean
	placeholder?: string
	size?: ComponentProps<typeof SelectTrigger>["size"]
	options: T[]
	getKey?: (item: T) => string
	getValue?: (item: T) => any
	getLabel?: (item: T) => string
	getDisabled?: (item: T) => boolean
	getGroup?: (item: T) => string
}

export default function RHFSelect<T>({
	name,
	label,
	required,
	placeholder,
	size,
	options,
	getKey,
	getLabel,
	getValue,
	getDisabled,
	getGroup,
}: Props<T>) {
	const grouped = Object.groupBy(options, (item) => getGroup?.(item) ?? "")

	return (
		<FormField
			name={name}
			render={({ field }) => {
				return (
					<FormItem>
						{label && (
							<FormLabel>
								{label} {required && "*"}
							</FormLabel>
						)}
						<Select
							defaultValue={field.value}
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
									<SelectValue placeholder={placeholder} />
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
