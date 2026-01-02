'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useSse } from '@/lib/sse'
import TestConnectionButton from '@/sections/model/components/test-connection-button'
import {
	getErrorMessage,
	getStatusColor,
	getStatusText,
} from '@/sections/model/utils/status'
import type { ModelsResponseItem } from '@/types/model'
import { t } from '@lingui/core/macro'
import type { ModelStatus } from '@repo/db/models'
import {
	AlertTriangleIcon,
	Calendar,
	Key,
	Link,
	Loader2,
	Server,
	Tag,
} from 'lucide-react'
import { useState } from 'react'

interface ModelDetailsProps {
	model: ModelsResponseItem
}

export default function ModelDetails({
	model: initialModel,
}: ModelDetailsProps) {
	const [model, setModel] = useState(initialModel)

	useSse('model.status.change', e => {
		if (e.id === model.id) {
			setModel(model => ({
				...model,
				status: e.status,
				error: e.message!,
			}))
		}
	})

	const handleStatus = (status: ModelStatus) => () => {
		setModel(model => ({ ...model, status }))
	}

	return (
		<div className="space-y-2 text-wrap! wrap-break-word!">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-lg font-semibold ">{model.name}</h3>
					<p className="mt-1 text-muted-foreground">
						{model.connection.identifier}
					</p>
				</div>
				<Badge className={getStatusColor(model.status)}>
					{getStatusText(model.status)}
				</Badge>
			</div>

			{/* Configuration Details */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 ">
						<Server className="size-5" />
						{t`Settings`}
					</CardTitle>
					<CardDescription>
						{t`Technical details of the connection to the model`}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium ">
								<Tag className="size-4" />
								{t`Model`}
							</div>
							<p className="font-mono text-muted-foreground">
								{model.name}
							</p>
						</div>

						{model.apiKey && (
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium">
									<Key className="size-4" />
									{t`API Key`}
								</div>
								<p className="font-mono text-muted-foreground">
									{model.apiKey}
								</p>
							</div>
						)}

						{model.connection.url && (
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium">
									<Link className="size-4" />
									{t`Endpoint`}
								</div>
								<p className="font-mono break-all text-muted-foreground">
									{model.connection.url}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Usage Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="size-5" />
						{t`Usage Information`}
					</CardTitle>
					<CardDescription>
						{t`Important dates and usage statistics`}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="text-sm font-medium">
								{t`Creation date`}
							</div>
							<p className="text-muted-foreground">
								{new Date(model.createdAt).toLocaleDateString(
									'es-ES',
									{
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									},
								)}
							</p>
						</div>

						{model.usedAt && (
							<div className="space-y-2">
								<div className="text-sm font-medium">
									{t`Last use`}
								</div>
								<p className="text-muted-foreground">
									{new Date(model.usedAt).toLocaleDateString(
										'es-ES',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										},
									)}
								</p>
							</div>
						)}

						<div className="space-y-2">
							<div className="text-sm font-medium ">
								{t`Model ID`}
							</div>
							<p className="font-mono text-muted-foreground">
								{model.connection.identifier}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Connection Test */}
			<Card>
				<CardHeader>
					<CardTitle className="">{t`Connection Test`}</CardTitle>
					<CardDescription>
						{t`Verify that the model configuration is correct`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm text-muted-foreground">
							{t`Status`}:
						</span>
						<Badge className={getStatusColor(model.status)}>
							{model.status === 'connecting' && (
								<Loader2 className="animate-spin" />
							)}
							{getStatusText(model.status)}
						</Badge>
						<TestConnectionButton
							id={model.id}
							className="ml-auto"
							onExecute={handleStatus('connecting')}
							onSuccess={handleStatus('active')}
							onError={handleStatus('error')}
						/>
						{model.error && (
							<Alert variant="destructive">
								<AlertTriangleIcon />
								<AlertTitle>
									{getErrorMessage(model.error).title}
								</AlertTitle>
								<AlertDescription>
									{getErrorMessage(model.error).description}
								</AlertDescription>
							</Alert>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
