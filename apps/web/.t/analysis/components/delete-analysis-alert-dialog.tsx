"use client"

import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteAnalysis } from "@/services/analysis"

interface Props {
	model: any
}

export default function DeleteAnalysisAlertDialog({ model }: Props) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete analysis</AlertDialogTitle>
					<AlertDialogDescription>
						Are you shure yo want delete this analysis?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							variant="destructive"
							onClick={() => deleteAnalysis("")}
						>
							Delete
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialogPortal>
	)
}
