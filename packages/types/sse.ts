import type { $Enums } from '@repo/db/models'

export type MessageMapper = {
	'model.status.change': { id: string; status: $Enums.ModelStatus }
}
