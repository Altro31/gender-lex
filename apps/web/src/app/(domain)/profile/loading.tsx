export default function Loading() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<div className="animate-pulse space-y-8">
					<div className="space-y-2">
						<div className="h-8 w-1/4 rounded bg-gray-200"></div>
						<div className="h-4 w-1/2 rounded bg-gray-200"></div>
					</div>

					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						<div className="lg:col-span-1">
							<div className="space-y-4 rounded-lg bg-white p-6 shadow">
								<div className="mx-auto h-24 w-24 rounded-full bg-gray-200"></div>
								<div className="mx-auto h-6 w-3/4 rounded bg-gray-200"></div>
								<div className="mx-auto h-4 w-1/2 rounded bg-gray-200"></div>
								<div className="space-y-2">
									{[...Array(4)].map((_, i) => (
										<div
											key={i}
											className="h-4 rounded bg-gray-200"
										></div>
									))}
								</div>
							</div>
						</div>

						<div className="lg:col-span-2">
							<div className="space-y-4 rounded-lg bg-white p-6 shadow">
								<div className="h-6 w-1/3 rounded bg-gray-200"></div>
								<div className="space-y-4">
									{[...Array(6)].map((_, i) => (
										<div
											key={i}
											className="h-4 rounded bg-gray-200"
										></div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
