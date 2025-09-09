import type { MouseEvent } from "react"

export function closeDialog(e: MouseEvent<HTMLButtonElement>) {
	e.preventDefault()
	e.currentTarget.parentElement?.click()
}
