import type { Decrement } from "@/types/utils"
import { AnimatePresence, motion } from "motion/react"
import { useState, type ComponentProps, type MouseEvent } from "react"

type Steps<S extends number> = S extends 0
	? 0
	: S extends 1
		? 1
		: S | Steps<Decrement<S>>

type ReadonlyArray = readonly any[]

type UseFormStepsProps<T extends ReadonlyArray> = {
	steps: T
	onStepValidation?: (
		step: Steps<T["length"]>,
		currentStepData: T[number],
	) => Promise<boolean> | boolean
}

export function useMultiStepForm<
	T extends ReadonlyArray,
	AvailableSteps = Steps<T["length"]>,
>({ steps, onStepValidation }: UseFormStepsProps<T>) {
	const [currentStep, setCurrentStep] = useState<AvailableSteps>(1 as any)
	const currentStepData = steps[(currentStep as any) - 1]! as T[number]
	const goToNext = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (onStepValidation) {
			// @ts-ignore
			const isValid = await onStepValidation(currentStep, currentStepData)
			if (!isValid) return false
		}
		// @ts-ignore
		if (currentStep < steps.length) {
			// @ts-ignore
			setCurrentStep((step) => step + 1)
			return true
		}
		return false
	}
	const goToPrevious = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		// @ts-ignore
		if (currentStep > 1) {
			// @ts-ignore
			setCurrentStep((step) => step - 1)
		}
	}

	const AnimateContainer = ({
		children,
		className,
	}: ComponentProps<"div">) => (
		<AnimatePresence mode="popLayout">
			<motion.div
				// @ts-ignore
				key={currentStep}
				initial={{ opacity: 0, x: 15 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -15 }}
				transition={{ duration: 0.4, type: "spring" }}
				className={className}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	)

	return {
		steps,
		currentStep,
		currentStepData,
		progress: ((1 / (steps.length - 1)) *
			// @ts-ignore
			(currentStep - 1) *
			100) as number,
		isFirstStep: currentStep === 1,
		isLastStep: currentStep === steps.length,
		goToNext,
		goToPrevious,
		AnimateContainer,
	}
}
