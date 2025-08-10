import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient({
	handleServerError: (e) => e,
})
