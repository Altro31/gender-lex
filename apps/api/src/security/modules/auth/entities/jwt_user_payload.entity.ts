import type { User } from '@repo/db/models'

export class JWTUserPayload {
	sub: User['id']
	email: User['email']
	provider: User['provider']
}
