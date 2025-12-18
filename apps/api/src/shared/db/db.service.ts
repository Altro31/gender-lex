import { Effect } from 'effect'

import { client } from '@repo/db/client'

export class DBService extends Effect.Service<DBService>()('DBService', {
	sync: () => client,
}) {
	static provide = Effect.provide(this.Default)
}
