declare global {
	interface DirectiveRegistry {
		/**
		 * Marks a function as a durable workflow entry point
		 *
		 * @inline A durable workflow entry point.
		 */
		"use workflow": never

		/**
		 * Marks a function as an atomic, retryable step.
		 *
		 * @inline An atomic, retryable step.
		 */
		"use step": never
}

export {}
