"use client"

import { useEffect } from "react"

interface Props {
	url: string
}

export default function UrlFixer({ url }: Props) {
	useEffect(() => {
		window.history.replaceState(null, "", url)
	}, [url])
	return null
}
