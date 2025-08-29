import { $Enums } from "@repo/db/models"
import { z } from "zod/mini"

export function getStatusColor(status: $Enums.ModelStatus) {
	const validatedStatus = z.enum($Enums.ModelStatus).parse(status)
	return statusOptions[validatedStatus]
}

const statusOptions = {
	active: "bg-green-100 text-green-800 hover:bg-green-200",
	inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
	error: "bg-red-100 text-red-800 hover:bg-red-200",
	connecting: "bg-gray-100 text-gray-800 hover:bg-gray-200",
} as const satisfies Record<$Enums.ModelStatus, string>
