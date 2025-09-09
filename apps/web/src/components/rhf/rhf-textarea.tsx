import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { type ComponentProps } from "react"

interface Props extends ComponentProps<typeof Textarea> {
	name: string
	label?: string
}

export default function RHFTextarea({
	label,
	name,
	required,
	onChange,
	...props
}: Props) {
	return (
		<FormField
			name={name}
			render={({ field }) => (
				<FormItem className="w-full">
					{label && (
						<FormLabel>
							{label} {required && "*"}
						</FormLabel>
					)}
					<FormControl>
						<Textarea
							{...props}
							value={field.value}
							onChange={(e) => {
								const val = e.target.value
								field.onChange(val)
								onChange?.(e)
							}}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
