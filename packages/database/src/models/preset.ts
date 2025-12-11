import { Schema } from 'effect'
import { type Preset as ZenPreset } from '../generated/models'
import { UserId } from './user'

export type PresetId = typeof PresetId.Type
export const PresetId = Schema.String.pipe(Schema.brand('PresetId'))

export class Preset
	extends Schema.TaggedClass<Preset>()('Preset', {
		id: PresetId,
		name: Schema.String,
		createdAt: Schema.Date,
		updatedAt: Schema.Date,
		userId: UserId,
		description: Schema.NullOr(Schema.String),
		isDefault: Schema.Boolean,
		usedAt: Schema.NullOr(Schema.Date),
	})
	implements ZenPreset {}
