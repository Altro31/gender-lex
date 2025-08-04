export default function Loading() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<div className="animate-pulse space-y-8">
					<div className="space-y-2">
						<div className="h-8 bg-gray-200 rounded w-1/4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-1">
							<div className="bg-white rounded-lg shadow p-6 space-y-4">
								<div className="h-24 w-24 bg-gray-200 rounded-full mx-auto"></div>
								<div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
								<div className="space-y-2">
									{[...Array(4)].map((_, i) => (
										<div
											key={i}
											className="h-4 bg-gray-200 rounded"
										></div>
									))}
								</div>
							</div>
						</div>

						<div className="lg:col-span-2">
							<div className="bg-white rounded-lg shadow p-6 space-y-4">
								<div className="h-6 bg-gray-200 rounded w-1/3"></div>
								<div className="space-y-4">
									{[...Array(6)].map((_, i) => (
										<div
											key={i}
											className="h-4 bg-gray-200 rounded"
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
