"use client"

import { Form } from "@/components/ui/form"
import { HomeSchema } from "@/sections/home/form/home-schema"
import { prepareAnalysis } from "@/services/analysis"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import type { Preset } from "@repo/db/models"
import type { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"

interface Props extends PropsWithChildren {
	lastUsedPreset: Pick<Preset, "id" | "name">
}

export default function HomeFormProvider({ children, lastUsedPreset }: Props) {
	const form = useForm({
		resolver: standardSchemaResolver(HomeSchema),
		defaultValues: {
			files: [],
			text: "",
			selectedPreset: lastUsedPreset,
		},
		mode: "all",
	})

	const onSubmit = async (data: HomeSchema) => prepareAnalysis(data)

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
		</Form>
	)
}
