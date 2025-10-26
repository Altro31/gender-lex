'use client'

import PasswordStrengthIndicator from '@/components/password-strength-indicator'
import TermsAndConditions from '@/components/terms-and-conditions'
import { Checkbox } from '@/components/ui/checkbox'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLingui } from '@lingui/react/macro'

export default function RegisterForm() {
	const { t } = useLingui()

	return (
		<>
			<FormField
				name="name"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>{t`Name`} *</FormLabel>
						<FormControl>
							<Input
								placeholder={t`Your name`}
								type={'text'}
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
				name="email"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>{t`Email`} *</FormLabel>
						<FormControl>
							<Input
								placeholder={t`you@example.com`}
								type={''}
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
								{...field}
								placeholder={t`Your password`}
								type="password"
							/>
						</FormControl>
						{field.value && (
							<PasswordStrengthIndicator password={field.value} />
						)}
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				name="confirmPassword"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>{t`Confirm Password`} *</FormLabel>
						<FormControl>
							<Input
								{...field}
								placeholder={t`Confirm your password`}
								type="password"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				name="acceptTerms"
				render={({ field }) => (
					<FormItem className="">
						<div className="flex flex-row items-center gap-1 space-y-0 rounded-md">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel>
								<TermsAndConditions />
							</FormLabel>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	)
}
