import { Schema } from 'effect'
import { Role, User as ZenUser } from '../generated/models'

export type UserId = typeof UserId.Type
export const UserId = Schema.String.pipe(Schema.brand('UserId'))

export class User
	extends Schema.TaggedClass<User>()('User', {
		id: UserId,
		name: Schema.String,
		email: Schema.String,
		emailVerified: Schema.Boolean,
		image: Schema.NullOr(Schema.String),
		isAnonymous: Schema.NullOr(Schema.Boolean),
		loggedAt: Schema.NullOr(Schema.Date),
		role: Schema.Enums(Role),
		createdAt: Schema.Date,
		updatedAt: Schema.Date,
	})
	implements ZenUser {}
