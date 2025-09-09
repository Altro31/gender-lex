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
import { useFormContext, useFormState } from "react-hook-form"

export function MultiStepViewer() {
	const { trigger } = useFormContext<ModelSchema>()
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
					Step {currentStep} of {stepFormElements.length}
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
					Previous
				</Button>
				{isLastStep ? (
					<Button size="sm" type="submit" disabled={submitting}>
						{submitting && <Loader2 className="animate-spin" />}
						{submitting ? "Submitting..." : "Submit"}
					</Button>
				) : (
					<Button
						size="sm"
						type="button"
						variant={"secondary"}
						onClick={goToNext}
					>
						Next
					</Button>
				)}
			</div>
		</div>
	)
}

const stepFormElements = [
	<div key="step-1" className="space-y-3">
		<div className="flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
			<FormField
				name="name"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Nombre del modelo *</FormLabel>
						<FormControl>
							<Input
								placeholder="ej: GPT-4 Principal"
								type={"text"}
								value={field.value}
								onChange={(e) => {
									const val = e.target.value
									field.onChange(val)
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
		<div className="flex w-full flex-wrap items-start justify-between gap-2 sm:flex-nowrap">
			<FormField
				name="connection.identifier"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Identificador *</FormLabel>
						<FormControl>
							<Input
								placeholder="identificador del modelo"
								type={"text"}
								value={field.value}
								onChange={(e) => {
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
				name="connection.url"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>URL *</FormLabel>
						<FormControl>
							<Input
								placeholder="URL del modelo"
								type="url"
								value={field.value}
								onChange={(e) => {
									const val = e.target.value
									field.onChange(val)
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
		<FormField
			name="apiKey"
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel>Api Key (Opcional)</FormLabel>
					<FormControl>
						<Input
							placeholder="Inserte la Api Key"
							type={"password"}
							value={field.value}
							onChange={(e) => {
								const val = e.target.value
								field.onChange(val)
							}}
						/>
					</FormControl>

					<FormMessage />
				</FormItem>
			)}
		/>
	</div>,
	<div key="step-2">
		<FormField
			name="settings.temperature"
			render={({ field }) => (
				<FormItem className="w-full py-3">
					<FormLabel className="flex items-center justify-between">
						Temperatura
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
						Ajusta la temperatura del modelo
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	</div>,
] as const
