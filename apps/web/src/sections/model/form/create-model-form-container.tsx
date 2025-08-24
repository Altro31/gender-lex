"use client"

import { Form } from "@/components/ui/form"
import { MultiStepViewer } from "@/sections/model/form/model-form"
import { ModelSchema } from "@/sections/model/form/model-schema"
import { createModel } from "@/services/model"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function CreateModelFormContainer() {
	

	const form = useForm<ModelSchema>({
		resolver: standardSchemaResolver(ModelSchema),
		defaultValues: {
			apiKey: "",
			connection: { identifier: "", url: "" },
			name: "",
			provider: "",
			settings: { temperature: 0.8 },
		},
		mode: "onChange",
	})
	const doSthAction = useAction(createModel, {
		onSuccess: ({}) => {
			console.log("succeed")
		},
		onError: ({ error }) => {
			console.log("error", error)
		},
	})

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(doSthAction.execute)}
					className="mx-auto flex w-full max-w-3xl flex-col gap-2 p-2 md:p-5"
				>
					<MultiStepViewer />
				</form>
			</Form>
		</div>
	)
}
