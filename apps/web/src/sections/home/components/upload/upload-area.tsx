"use client"

import { cn } from "@/lib/utils"
import type { HomeSchema } from "@/sections/home/form/home-schema"
import { useTranslations } from "next-intl"
import { useRef, useState, type ComponentProps, type DragEvent } from "react"
import { useFormContext } from "react-hook-form"

interface Props extends ComponentProps<"div"> {}

export default function RHFUploadArea({
	children,
	className,
	...props
}: Props) {
	const t = useTranslations()
	const { setValue, getValues } = useFormContext<HomeSchema>()
	const [isDragging, setIsDragging] = useState(false)
	const dropAreaRef = useRef<HTMLDivElement>(null)

	function handleDragEnter(e: DragEvent<HTMLDivElement>) {
		const element = e.currentTarget as HTMLElement
		const target = e.target as HTMLElement
		if (element !== target) return
		setIsDragging(true)
	}

	function handleDragOver(e: DragEvent<HTMLDivElement>) {
		const item = e.dataTransfer?.items[0]
		if (item?.kind !== "file") return
		e.preventDefault()
	}

	function handleDragExit(e: DragEvent<HTMLDivElement>) {
		const target = e.target as HTMLElement
		if (target !== dropAreaRef.current) return
		setIsDragging(false)
	}

	function handleDrop(e: DragEvent<HTMLDivElement>) {
		e.preventDefault()
		const file = e.dataTransfer?.files.item(0)!
		setIsDragging(false)
		const files = getValues("files")
		setValue("files", [...files, { file }])
	}

	return (
		<div
			onDragEnter={handleDragEnter}
			className={cn(className, "relative")}
			{...props}
		>
			<div
				onDragLeave={handleDragExit}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				ref={dropAreaRef}
				data-drag={isDragging || undefined}
				className="absolute top-0 left-0 z-10 hidden size-full p-2 data-drag:block"
			>
				<div className="grid size-full place-content-center rounded-xl border-2 border-dashed backdrop-blur-xs">
					<div className="aspect-video w-[50vw]">
						{t("Upload.drop")}
					</div>
				</div>
			</div>
			{children}
		</div>
	)
}
