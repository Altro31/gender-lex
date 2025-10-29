import { select } from "@lingui/core/macro"
import { ModelError, ModelStatus } from "@repo/db/models"
import { z } from "zod/mini"

export function getStatusColor(status: ModelStatus) {
	const validatedStatus = z.enum(ModelStatus).parse(status)
	return statusOptions[validatedStatus]
}

const statusOptions = {
	active: "bg-green-100 text-green-800 hover:bg-green-200",
	inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
	error: "bg-red-100 text-red-800 hover:bg-red-200",
	connecting: "bg-gray-100 text-gray-800 hover:bg-gray-200",
} as const satisfies Record<ModelStatus, string>

export function getStatusText(status: ModelStatus) {
	return select(status, {
		error: "Error",
		active: "Active",
		connecting: "Connecting",
		inactive: "Inactive",
		other: "Other",
	})
}

export function getErrorMessage(error: ModelError) {
	return {
		title: select(error, {
			INVALID_API_KEY: "Invalid API key",
			INVALID_IDENTIFIER: "Invalid identifier",
			INVALID_CONNECTION_URL: "Invalid connection URL",
			INACTIVE_MODEL: "Inactive model",
			MAX_ATTEMPTS_REACHED: "Maximum number of attempts reached",
			other: "Other",
		}),
		description: select(error, {
			INVALID_API_KEY:
				"The provided API key is invalid or has expired. \nVerify that it is copied correctly and that it has valid permissions.",
			INVALID_IDENTIFIER:
				"The submitted identifier does not match any valid model. \nCheck that this model exists in your provider.",
			INVALID_CONNECTION_URL:
				"The connection URL is invalid or cannot be resolved. \nReview the configuration and protocol.",
			INACTIVE_MODEL:
				"The requested model is not active or available. \nSelect a valid model or contact the administrator.",
			MAX_ATTEMPTS_REACHED:
				"The maximum number of attempts allowed has been exceeded. \nWait before trying again or check your credentials.",
			other: "Other",
		}),
	}
}
