"use server"

import { endpoints } from "@/lib/endpoints"

export async function google(token: string) {
	const res = await fetch(endpoints.auth.google.callback, {
		method: "POST",
		headers: { Authorization: `Bearer ${token}` },
	})
	const data = await res.json()
	return data
}
