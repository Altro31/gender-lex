import type { $Enums } from '@repo/db/models'

export type MessageMapper = {
	'model.status.change': { id: string } & (
		| { status: Exclude<$Enums.ModelStatus, 'error'>; message?: null }
		| {
				status: Extract<$Enums.ModelStatus, 'error'>
				message: $Enums.ModelError
		  }
	)
}
