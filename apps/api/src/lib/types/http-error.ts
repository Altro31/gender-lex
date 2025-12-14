import { Data } from 'effect'

export const HttpTaggedError = <Name extends string>(name: Name) => {
	class BaseHttpTaggedError extends Data.TaggedError(name) {
		status: number = 400
		statusText: string = 'Bad request'
		override message: string = ''

		constructor(message?: string) {
			super()
			if (message) this.message = message
		}

		toResponse(): Response {
			return Response.json(
				{ message: this.message },
				{ status: this.status, statusText: this.statusText },
			)
		}
	}

	return BaseHttpTaggedError
}
