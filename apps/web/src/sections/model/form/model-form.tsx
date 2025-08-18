import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useMultiStepForm } from "@/hooks/use-multistep-form"
import { useFormContext } from "react-hook-form"
import { motion, AnimatePresence } from "motion/react"
import type { ModelSchema } from "@/sections/model/form/model-schema"
import type { JSX } from "react"
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function MultiStepViewer() {
	const form = useFormContext<ModelSchema>()

	const stepFormElements: {
		[key: number]: JSX.Element
	} = {
		0: (
			<div className="space-y-3">
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
					<FormField
						name="provider"
						render={({ field }) => {
							const options = [
								{ value: "local", label: "Local" },
								{ value: "openai", label: "OpenAI" },
							]
							return (
								<FormItem className="w-full">
									<FormLabel>Proveedor *</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Seleccione un proveedor" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{options.map(({ label, value }) => (
												<SelectItem
													key={value}
													value={value}
												>
													{label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)
						}}
					/>
				</div>
				<div className="flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
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
										type={"url"}
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
		),
		1: (
			<div>
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
			</div>
		),
	}

	const steps = Object.keys(stepFormElements).map(Number)
	const { currentStep, isLastStep, goToNext, goToPrevious } =
		useMultiStepForm({
			initialSteps: steps,
			onStepValidation: () => {
				/**
				 * TODO: handle step validation
				 */
				return true
			},
		})
	const current = stepFormElements[currentStep - 1]
	const {
		formState: { isSubmitting },
	} = form
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col items-center justify-start gap-1">
				<span>
					Step {currentStep} of {steps.length}
				</span>
				<Progress value={(currentStep / steps.length) * 100} />
			</div>
			<AnimatePresence mode="popLayout">
				<motion.div
					key={currentStep}
					initial={{ opacity: 0, x: 15 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -15 }}
					transition={{ duration: 0.4, type: "spring" }}
					className="flex flex-col gap-2"
				>
					{current}
				</motion.div>
			</AnimatePresence>
			<div className="flex w-full items-center justify-between gap-3 pt-3">
				<Button
					size="sm"
					variant="ghost"
					onClick={goToPrevious}
					type="button"
				>
					Previous
				</Button>
				{isLastStep ? (
					<Button size="sm" type="submit">
						{isSubmitting ? "Submitting..." : "Submit"}
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
