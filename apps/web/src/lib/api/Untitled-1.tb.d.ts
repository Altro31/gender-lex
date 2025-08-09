type FilterPaths<
	ResponseType extends ResponseTypes,
	Paths = keyof paths,
> = Paths extends infer U
	? U extends keyof paths
		? paths[U]["get"] extends infer P extends undefined
			? P extends undefined
				? never
				: P extends {
							responses: {
								200: {
									content: { [Key in ResponseTypes]?: any }
								}
							}
					  }
					? P["responses"][200]["content"][ResponseType] extends infer Data
						? Data extends undefined
							? never
							: U
						: never
					: never
			: never
		: never
	: never
