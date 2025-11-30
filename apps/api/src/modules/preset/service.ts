import { Effect } from 'effect'

export class PresetService extends Effect.Service<PresetService>()(
	'PresetService',
	{
		effect: Effect.gen(function* () {
			return {}
		}),
		dependencies: [],
	},
) {
	static provide = Effect.provide(this.Default)
}
