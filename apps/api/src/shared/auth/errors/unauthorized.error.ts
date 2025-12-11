import { HttpTaggedError } from '@/lib/types/http-error'

export class UnauthorizedError extends HttpTaggedError('UnauthorizedError') {
	override status = 401
	override statusText = 'Unauthorized'
}
