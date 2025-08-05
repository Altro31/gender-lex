import type { paths } from "@/lib/api/types"

type Methods = keyof paths[keyof paths]

type FilterPaths<Paths = keyof paths> = Paths extends infer U
	? U extends keyof paths
		? paths[U]["get"] extends infer P
			? P extends undefined
				? never
				: P extends {
							responses: {
								200: {
									content: {
										"application/vnd.api+json": infer Data
									}
								}
							}
					  }
					? U
					: never
			: U
		: U
	: never

export type ApiResponse<Path extends FilterPaths> =
	paths[Path]["get"]["responses"][200]["content"]["application/vnd.api+json"]
