import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<Skeleton className="mb-2 h-9 w-48" />
					<Skeleton className="h-6 w-96" />
				</div>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Profile Card */}
					<div className="lg:col-span-1">
						<Card className="sticky top-8">
							<CardHeader className="pb-4 text-center">
								<div className="relative mx-auto mb-4">
									<Skeleton className="mx-auto h-24 w-24 rounded-full" />
								</div>
								<Skeleton className="mx-auto mb-2 h-7 w-40" />
								<Skeleton className="mx-auto h-5 w-56" />
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="flex items-center justify-between"
										>
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-5 w-32" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-2">
						<Card>
							<CardHeader>
								<Skeleton className="mb-2 h-7 w-48" />
								<Skeleton className="h-5 w-72" />
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									{[1, 2, 3, 4].map((i) => (
										<div key={i} className="space-y-2">
											<Skeleton className="h-4 w-32" />
											<Skeleton className="h-5 w-full" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
