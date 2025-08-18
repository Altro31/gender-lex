"use client"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { MultiStepViewer } from "@/sections/model/form/model-form"
import { ModelSchema } from "@/sections/model/form/model-schema"
import { createModel } from "@/services/model"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"

export default function CreateModelFormContainer() {
	const form = useForm<ModelSchema>({
		resolver: zodResolver(ModelSchema),
		defaultValues: {
			apiKey: "",
			connection: { identifier: "", url: "" },
			name: "",
			provider: "",
			settings: { temperature: 0.8 },
		},
	})
	const doSthAction = useAction(createModel, {
		onSuccess: () => {},
		onError: () => {},
	})

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(doSthAction.execute)}
					className="mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-md border p-2 md:p-5"
				>
					<MultiStepViewer />
				</form>
			</Form>
		</div>
	)
}
