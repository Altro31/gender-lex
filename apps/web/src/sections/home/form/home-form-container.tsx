"use client"

import { Textarea } from "@/components/ui/textarea"
import UploadButton from "@/sections/home/components/upload/upload-button"
import FormSendButton from "@/sections/home/form/home-form-send-button"
import { useDroppedFile } from "@/sections/home/stores/dropped-file"
import { prepareAnalysis } from "@/services/analysis"
import Form from "next/form"
import { useEffect, useState, type FormEventHandler } from "react"

type Input = string | undefined

export default function HomeFormContainer() {
	const [inputValue, setInputValue] = useState<Input>("")
	const { file } = useDroppedFile()

	const onFileUpload = (file: File) => {
		setInputValue(`📃 ${file.name} (${(file.size / 1024).toFixed(2)}KB)`)
	}

	const handleInput: FormEventHandler<HTMLTextAreaElement> = (e) => {
		setInputValue(e.currentTarget.value)
	}

	useEffect(() => {
		if (file !== null) onFileUpload(file)
	}, [file, onFileUpload])

	return (
		<Form action={prepareAnalysis} className="group flex h-full gap-2 pr-2">
			<Textarea
				name="text"
				className="bg-background resize-none px-4"
				placeholder="Analizar un texto..."
				id="analyze-text"
				value={inputValue}
				onInput={handleInput}
			/>
			<div className="flex flex-col gap-1">
				<FormSendButton disabled={!inputValue} />
				<UploadButton
					disabled={!inputValue}
					onFileUpload={onFileUpload}
				/>
			</div>
		</Form>
	)
}
