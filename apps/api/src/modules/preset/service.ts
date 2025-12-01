import { Effect } from 'effect'

export class PresetService extends Effect.Service<PresetService>()(
	'PresetService',
	{ effect: Effect.succeed({}), dependencies: [] },
) {
	static provide = Effect.provide(this.Default)
}
