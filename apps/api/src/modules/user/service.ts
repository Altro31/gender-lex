import { Effect } from 'effect'

export class UserService extends Effect.Service<UserService>()('UserService', {
	effect: Effect.gen(function* () {
		return {}
	}),
	dependencies: [],
}) {
	static provide = Effect.provide(this.Default)
}
