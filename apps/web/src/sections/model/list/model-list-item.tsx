'use client'

import Loader from '@/components/loader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSse } from '@/lib/sse'
import { DeleteModelAlertDialogTrigger } from '@/sections/model/components/dialogs/delete-model-alert-dialog'
import { DetailsModelDialogTrigger } from '@/sections/model/components/dialogs/details-model-dialog'
import {
	EditModelDialog,
	EditModelDialogTrigger,
} from '@/sections/model/components/dialogs/edit-model-dialog'
import TestConnectionButton from '@/sections/model/components/test-connection-button'
import {
	getErrorMessage,
	getStatusColor,
	getStatusText,
} from '@/sections/model/utils/status'
import type { ModelsResponseItem } from '@/types/model'
import { i18n } from '@lingui/core'
import { t } from '@lingui/core/macro'
import { ModelError } from '@repo/db/models'
import { Edit, Eye, Loader2, Settings, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Props {
	model: ModelsResponseItem & { itemStatus?: 'deleting' }
}

export default function ModelListItem({ model: initialModel }: Props) {
	const [model, setModel] = useState(initialModel)
	const [status, setStatus] = useState(model.status)

	useEffect(() => {
		setModel(initialModel)
	}, [initialModel, setModel])

	useSse('model.status.change', event => {
		if (event.id === model.id) {
			setStatus(event.status)
			if (event.status === 'error') {
				toast.error(
					`${model.name}: ${getErrorMessage(model.error as ModelError).title}`,
				)
			}
		}
	})

	const handleItemStatus = (status: Props['model']['itemStatus']) => () => {
		setModel(model => ({ ...model, itemStatus: status }))
	}

	const isDeleting = model.itemStatus === 'deleting'
	const isDisabled = isDeleting
	const isDefault = model.isDefault

	return (
		<Card
			key={model.id}
			data-disabled={isDisabled || undefined}
			className="after:bg-muted/80 relative overflow-clip transition-shadow after:absolute after:top-0 after:size-full not-data-disabled:after:hidden hover:shadow-lg"
		>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle>{model.name}</CardTitle>
						<CardDescription>
							{model.connection.identifier}
						</CardDescription>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger
							render={<Button variant="ghost" size="sm" />}
							className="size-8 p-0"
						>
							<Settings />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DetailsModelDialogTrigger
								nativeButton={false}
								payload={{ model }}
								render={
									<DropdownMenuItem disabled={isDeleting} />
								}
							>
								<Eye />
								{t`Details`}
							</DetailsModelDialogTrigger>

							{!isDefault && (
								<>
									<EditModelDialogTrigger
										nativeButton={false}
										payload={{ model }}
										render={
											<DropdownMenuItem
												disabled={isDeleting}
											/>
										}
									>
										<Edit />
										{t`Edit`}
									</EditModelDialogTrigger>
									<DeleteModelAlertDialogTrigger
										nativeButton={false}
										payload={{
											model,
											onDelete:
												handleItemStatus('deleting'),
										}}
										render={
											<DropdownMenuItem
												variant="destructive"
												disabled={isDeleting}
											/>
										}
									>
										{isDeleting ? <Loader /> : <Trash2 />}
										{t`Delete`}
									</DeleteModelAlertDialogTrigger>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>

			<CardContent className="flex-1 space-y-2">
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-sm text-muted-foreground">
						{t`Status`}:
					</span>
					<Badge className={getStatusColor(status)}>
						{status === 'connecting' && (
							<Loader2 className="animate-spin" />
						)}
						{getStatusText(status)}
					</Badge>
					<TestConnectionButton
						id={model.id}
						onExecute={() => setStatus('connecting')}
						onSuccess={() => setStatus('active')}
						onError={() => setStatus('error')}
					/>
				</div>
			</CardContent>
			<CardFooter className="border-t">
				<div className="w-full text-xs text-muted-foreground">
					<div className="flex justify-between">
						<span>
							{t`Created at`}:{' '}
							{new Date(model.createdAt).toLocaleDateString(
								i18n.locale,
							)}
						</span>
						{model.usedAt && (
							<span>
								{t`Last use`}:{' '}
								{new Date(model.usedAt).toLocaleDateString(
									i18n.locale,
								)}
							</span>
						)}
					</div>
				</div>
			</CardFooter>
			{isDisabled && (
				<div className="text-muted-foreground absolute top-0 z-10 size-full">
					<div className="flex size-full items-center justify-center gap-2">
						<Loader />
						{isDeleting && <span>{t`Deleting...`}</span>}
					</div>
				</div>
			)}
		</Card>
	)
}
