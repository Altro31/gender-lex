import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { type ComponentProps, type PropsWithChildren } from "react"

interface Props extends ComponentProps<typeof Input> {
	name: string
	label?: string
}

export default function RHFInput({
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
						<Input
							type="text"
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
