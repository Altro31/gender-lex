'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { t } from '@lingui/core/macro'

export default function LoginForm() {
	return (
		<>
			<FormField
				name="email"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>{t`Email`} *</FormLabel>
						<FormControl>
							<Input
								placeholder={t`you@example.com`}
								type={'email'}
								value={field.value}
								onChange={e => {
									const val = e.target.value
									field.onChange(val)
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				name="password"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>{t`Password`} *</FormLabel>
						<FormControl>
							<Input
								placeholder={t`Your password`}
								type={'password'}
								value={field.value}
								onChange={e => {
									const val = e.target.value
									field.onChange(val)
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className="flex items-center justify-between">
				<FormField
					name="rememberMe"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center space-y-0 rounded-md">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>{t`Remember me`}</FormLabel>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>
			</div>
		</>
	)
}
