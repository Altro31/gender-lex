"use client"

import { DialogClose } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { MultiStepViewer } from "@/sections/model/form/model-form"
import { ModelSchema } from "@/sections/model/form/model-schema"
import { createModel } from "@/services/model"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useAction } from "next-safe-action/hooks"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function CreateModelFormContainer() {
	const ref = useRef<HTMLButtonElement>(null)

	const form = useForm<ModelSchema>({
		resolver: standardSchemaResolver(ModelSchema),
		defaultValues: {
			apiKey: "",
			connection: { identifier: "", url: "" },
			name: "",
			provider: "" as any,
			settings: { temperature: 0.8 },
		},
		mode: "onChange",
	})
	const doSthAction = useAction(createModel, {
		onSuccess: () => {
			toast.success("Ok")
			ref.current?.click()
		},
		onError: ({ error }) => {
			console.log("error", error)
			toast.success("Error")
		},
	})

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(doSthAction.executeAsync)}
					className="mx-auto flex w-full max-w-3xl flex-col gap-2 p-2"
				>
					<DialogClose ref={ref} className="hidden" />
					<MultiStepViewer />
				</form>
			</Form>
		</div>
	)
}
