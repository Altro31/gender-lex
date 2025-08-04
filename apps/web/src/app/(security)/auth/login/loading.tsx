export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="animate-pulse space-y-6">
					<div className="h-8 bg-gray-200 rounded w-1/3"></div>
					<div className="bg-white rounded-lg shadow-xl p-6 space-y-4">
						<div className="h-12 bg-gray-200 rounded-xl w-12 mx-auto"></div>
						<div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
						<div className="space-y-3">
							<div className="h-11 bg-gray-200 rounded"></div>
							<div className="h-11 bg-gray-200 rounded"></div>
						</div>
						<div className="h-px bg-gray-200"></div>
						<div className="space-y-3">
							<div className="h-11 bg-gray-200 rounded"></div>
							<div className="h-11 bg-gray-200 rounded"></div>
						</div>
						<div className="h-11 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		</div>
	)
}
