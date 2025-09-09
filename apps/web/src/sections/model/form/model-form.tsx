import RHFInput from "@/components/rhf/rhf-input"
import { Button } from "@/components/ui/button"
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { useMultiStepForm } from "@/hooks/use-multistep-form"
import type { ModelSchema } from "@/sections/model/form/model-schema"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormContext, useFormState } from "react-hook-form"

export function MultiStepViewer() {
	const t = useTranslations()
	const { trigger } = useFormContext<ModelSchema>()

	const stepFormElements = [
		<div key="step-1" className="space-y-3">
			<div className="flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
				<RHFInput
					name="name"
					label={t("Model.form.name.label")}
					required
					placeholder={t("Model.form.name.placeholder")}
				/>
			</div>
			<div className="flex w-full flex-wrap items-start justify-between gap-2 sm:flex-nowrap">
				<RHFInput
					name="connection.identifier"
					label={t("Commons.identifier")}
					required
					placeholder={t(
						"Model.form.connection-identifier.placeholder",
					)}
				/>
				<RHFInput
					name="connection.url"
					label="URL"
					required
					placeholder={t("Model.form.connection-url.placeholder")}
				/>
			</div>
			<RHFInput
				name="apiKey"
				label={`${t("Commons.api-key")} (${t("Commons.optional")})`}
				placeholder={t("Model.form.api-key.placeholder")}
				type="password"
			/>
		</div>,
		<div key="step-2">
			<FormField
				name="settings.temperature"
				render={({ field }) => (
					<FormItem className="w-full py-3">
						<FormLabel className="flex items-center justify-between">
							{t("Model.form.settings.temperature.label")}
							<span>{field.value}</span>
						</FormLabel>
						<FormControl>
							<Slider
								min={0}
								max={1}
								step={0.1}
								value={[field.value]}
								onValueChange={(values) => {
									field.onChange(values[0])
								}}
							/>
						</FormControl>
						<FormDescription>
							{t("Model.form.settings.temperature.description")}
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
		onStepValidation: async (step) => {
			if (step === 1) {
				return trigger(["apiKey", "connection", "name"], {
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
					{t("Commons.step")} {currentStep} {t("Commons.of")}{" "}
					{stepFormElements.length}
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
					{t("Commons.previous")}
				</Button>
				{isLastStep ? (
					<Button size="sm" type="submit" disabled={submitting}>
						{submitting && <Loader2 className="animate-spin" />}
						{submitting ? t("Actions.sending") : t("Actions.send")}
					</Button>
				) : (
					<Button
						size="sm"
						type="button"
						variant={"secondary"}
						onClick={goToNext}
					>
						{t("Commons.next")}
					</Button>
				)}
			</div>
		</div>
	)
}
