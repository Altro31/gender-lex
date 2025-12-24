import RHFInput from '@/components/rhf/rhf-input'
import { Button } from '@/components/ui/button'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { useMultiStepForm } from '@/hooks/use-multistep-form'
import type { ModelSchema } from '@/sections/model/form/model-schema'
import { t } from '@lingui/core/macro'
import { Loader2 } from 'lucide-react'
import { useFormContext, useFormState } from 'react-hook-form'

export function MultiStepViewer() {
	const { trigger } = useFormContext<ModelSchema>()

	const stepFormElements = [
		<div key="step-1" className="space-y-3">
			<div className="flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
				<RHFInput
					name="name"
					label={t`Model name`}
					required
					placeholder={t`ex: GPT-4 Main`}
				/>
			</div>
			<div className="flex w-full flex-wrap items-start justify-between gap-2 sm:flex-nowrap">
				<RHFInput
					name="connection.identifier"
					label={t`Identifier`}
					required
					placeholder={t`Model identifier`}
				/>
				<RHFInput
					name="connection.url"
					label="URL"
					required
					placeholder={t`Model URL`}
				/>
			</div>
			<RHFInput
				name="apiKey"
				label={`${t`API Key`} (${t`Optional`})`}
				placeholder={t`Insert the API Key`}
				type="password"
			/>
		</div>,
		<div key="step-2">
			<FormField
				name="settings.temperature"
				render={({ field }) => (
					<FormItem className="w-full py-3">
						<FormLabel className="flex items-center justify-between">
							{t`Temperature`}
							<span>{field.value}</span>
						</FormLabel>
						<FormControl>
							<Slider
								min={0}
								max={1}
								step={0.1}
								value={[field.value]}
								onValueChange={value => {
									field.onChange(value)
								}}
							/>
						</FormControl>
						<FormDescription>
							{t`Adjust the model temperature`}
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>,
	] as const

	const form = useFormState<ModelSchema>()
	const {
		currentStep,
		currentStepData,
		isLastStep,
		isFirstStep,
		goToNext,
		goToPrevious,
		progress,
		AnimateContainer,
	} = useMultiStepForm({
		steps: stepFormElements,
		onStepValidation: async step => {
			if (step === 1) {
				return trigger(['apiKey', 'connection', 'name'], {
					shouldFocus: true,
				})
			}
			return true
		},
	})

	const submitting = form.isSubmitting || form.isSubmitSuccessful

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center justify-start gap-1">
				<span>
					{t`Step`} {currentStep} {t`of`} {stepFormElements.length}
				</span>
				<Progress value={progress} />
			</div>
			<AnimateContainer className="flex flex-col gap-2">
				{currentStepData}
			</AnimateContainer>
			<div className="flex w-full items-center justify-between gap-3 pt-3">
				<Button
					size="sm"
					variant="ghost"
					onClick={goToPrevious}
					type="button"
					disabled={isFirstStep}
				>
					{t`Previous`}
				</Button>
				{isLastStep ? (
					<Button size="sm" type="submit" disabled={submitting}>
						{submitting && <Loader2 className="animate-spin" />}
						{submitting ? t`Sending...` : t`Send`}
					</Button>
				) : (
					<Button
						size="sm"
						type="button"
						variant={'secondary'}
						onClick={goToNext}
					>
						{t`Next`}
					</Button>
				)}
			</div>
		</div>
	)
}
