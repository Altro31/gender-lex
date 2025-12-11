import { Schema } from 'effect'
import {
	ModelError,
	ModelStatus,
	type Model as ZenModel,
} from '../generated/models'
import { UserId } from './user'

export type ModelId = typeof ModelId.Type
export const ModelId = Schema.String.pipe(Schema.brand('ModelId'))

export class Model
	extends Schema.TaggedClass<Model>()('Model', {
		id: ModelId,
		name: Schema.String,
		createdAt: Schema.Date,
		updatedAt: Schema.Date,
		userId: UserId,
		status: Schema.Enums(ModelStatus),
		isDefault: Schema.Boolean,
		usedAt: Schema.NullOr(Schema.Date),
		connection: Schema.Struct({
			identifier: Schema.String,
			url: Schema.String,
		}),
		settings: Schema.Struct({ temperature: Schema.Number }),
		apiKey: Schema.NullOr(Schema.String),
		error: Schema.NullOr(Schema.Enums(ModelError)),
	})
	implements ZenModel {}
