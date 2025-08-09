import type { paths } from "@/lib/api/types"

export type HttpActions = "get" | "post" | "delete" | "put" | "patch"

export type ApiResponse<Path extends keyof paths> =
	paths[Path][HttpActions] extends infer P
		? P extends undefined
			? never
			: P extends {
						responses: {
							200: {
								content: infer Content
							}
						}
				  }
				? P["responses"][200]["content"][keyof Content] extends infer Data
					? Data extends undefined
						? never
						: Data
					: never
				: never
		: never
