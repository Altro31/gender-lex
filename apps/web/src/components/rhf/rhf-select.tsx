import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { ComponentProps } from 'react'

interface Props<T> {
	name: string
	label?: string
	required?: boolean
	placeholder?: React.ReactNode
	size?: ComponentProps<typeof SelectTrigger>['size']
	options: T[]
	getKey: (item: T) => string
	renderItem?: (item: T) => React.ReactNode
	renderValue?: (item: T) => React.ReactNode
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
	renderValue = item => item as React.ReactNode,
	renderItem = item => item as React.ReactNode,
	getDisabled,
	getGroup,
}: Props<T>) {
	const grouped = Object.groupBy(options, item => getGroup?.(item) ?? '')

	return (
		<FormField
			name={name}
			render={({ field }) => {
				return (
					<FormItem>
						{label && (
							<FormLabel>
								{label} {required && '*'}
							</FormLabel>
						)}
						<Select
							value={field.value}
							onValueChange={field.onChange}
						>
							<FormControl>
								<SelectTrigger size={size}>
									<SelectValue>
										{(value: T) => {
											return value
												? renderValue(value)
												: placeholder
										}}
									</SelectValue>
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
												{value.map(item => {
													const itemKey = getKey(item)

													const itemLabel =
														renderItem(item)
													const itemDisabled =
														getDisabled?.(item) ??
														false

													return (
														<SelectItem
															key={itemKey + ''}
															value={item}
															disabled={
																itemDisabled
															}
														>
															{renderItem(item)}
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
