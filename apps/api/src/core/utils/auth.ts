import { pbkdf2Sync, randomBytes } from 'crypto'

export function extractBearer(authorization: string) {
	const splittedAuthorization = authorization.split(' ')
	return splittedAuthorization.at(1)
}

export function getEncryptionKey(token: string) {
	const salt = randomBytes(16)
	const key = pbkdf2Sync(token, salt, 100_000, 32, 'sha256')
	return key
}
