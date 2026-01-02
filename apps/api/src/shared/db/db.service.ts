import { Effect } from 'effect'

import { db } from '@repo/db/client'

export class DBService extends Effect.Service<DBService>()('DBService', {
	sync: () => db,
}) {
	static provide = Effect.provide(this.Default)
}
