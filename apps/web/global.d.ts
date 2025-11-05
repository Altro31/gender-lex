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

		/**
		 * Mark a route, React component, or a function as cacheable at build time
		 *  @module All exports in this module are cached at build time
		 *  @inline A function cached at build time
		 */
		"use cache": never

		/**
		 * Mark a route, React component, or a function as cacheable for user-specific content that requires access to cookies or headers
		 *
		 *  @module All exports in this module are private cached
		 *  @inline A function private cached
		 */
		"use cache: private": never

		/**
		 * Mark a route, React component, or a function as cacheable between requests that requires access to cookies or headers
		 *
		 *  @module All exports in this module are remote cached
		 *  @inline A function remote cached
		 */
		"use cache: remote": never
	}
}

export {}
