import { Effect } from 'effect'

import { client } from '@repo/db/client'
import { createEffectClient } from '@repo/db/effect'

export class DBService extends Effect.Service<DBService>()('DBService', {
	sync: () => createEffectClient(client),
}) {
	static provide = Effect.provide(this.Default)
}
