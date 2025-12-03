import { HttpError } from '@/lib/types/http-error'

export class UnauthorizedError extends HttpError('UnauthorizedError') {
	override status = 401
	override statusText = 'Unauthorized'
}
