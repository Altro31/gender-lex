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
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { ComponentProps } from 'react'

interface Props<T> {
	name: string
	label?: string
	required?: boolean
	placeholder?: string
	size?: ComponentProps<typeof SelectTrigger>['size']
	initialData?: T[]
	fetcherFunc: (params: { page: number }) => Promise<T[]>
	getKey: (item: T) => string
	renderItem: (item: T) => React.ReactNode
	renderValue: (item: T) => React.ReactNode
	renderLastItem?: React.ReactNode
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
	renderItem,
	renderValue,
	getDisabled,
	getGroup,
	renderLastItem,
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
		item => getGroup?.(item) ?? '',
	)

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
							<SelectContent className="w-min">
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
								{renderLastItem && (
									<>
										<SelectSeparator />
										<SelectGroup>
											{renderLastItem}
										</SelectGroup>
									</>
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
