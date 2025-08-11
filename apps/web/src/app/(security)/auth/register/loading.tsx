export default function Loading() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
			<div className="w-full max-w-md">
				<div className="animate-pulse space-y-6">
					<div className="h-8 w-1/3 rounded bg-gray-200"></div>
					<div className="space-y-4 rounded-lg bg-white p-6 shadow-xl">
						<div className="mx-auto h-12 w-12 rounded-xl bg-gray-200"></div>
						<div className="mx-auto h-6 w-2/3 rounded bg-gray-200"></div>
						<div className="mx-auto h-4 w-1/2 rounded bg-gray-200"></div>
						<div className="space-y-3">
							<div className="h-11 rounded bg-gray-200"></div>
							<div className="h-11 rounded bg-gray-200"></div>
						</div>
						<div className="h-px bg-gray-200"></div>
						<div className="space-y-3">
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className="h-11 rounded bg-gray-200"
								></div>
							))}
						</div>
						<div className="h-11 rounded bg-gray-200"></div>
					</div>
				</div>
			</div>
		</div>
	)
}
