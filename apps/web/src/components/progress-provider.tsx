"use client"

import { ProgressProvider as Provider } from "@bprogress/next/app"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {}

export default function ProgressProvider({ children }: Props) {
	return (
		<Provider color="blue" height="3px" options={{ showSpinner: false }}>
			{children}
		</Provider>
	)
}
