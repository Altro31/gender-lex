import { Effect } from 'effect'

import {
	PrismaClient as PrismaClientClass,
	adapter,
	extension,
} from '@repo/db/client'

export class RawPrismaService extends Effect.Service<RawPrismaService>()(
	'RawPrismaService',
	{ succeed: new PrismaClientClass({ adapter }).$extends(extension) },
) {}
