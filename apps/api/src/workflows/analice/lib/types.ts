import type { Session, User } from '@repo/db/models'

export interface WorkflowInput {
	input: string | File
	selectedPreset: string
	session: Session & { user: User }
}
