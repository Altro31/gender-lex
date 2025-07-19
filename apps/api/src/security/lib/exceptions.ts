import { ConflictException } from '@nestjs/common'

export class ExistingUserException extends ConflictException {
	constructor() {
		super('An user with the same email already exists')
	}
}
