import { Data, Effect } from 'effect'
import { Prisma, PrismaClient as RawPrismaClient } from '@repo/db/client'
import type { PrismaClient as EnhancedPrismaClient } from '@repo/db'

import type {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
	PrismaClientRustPanicError,
	PrismaClientInitializationError,
	PrismaClientValidationError,
} from '@prisma/client/runtime/library'

export class PrismaError extends Data.TaggedError('PrismaError')<{
	details:
		| PrismaClientKnownRequestError
		| PrismaClientUnknownRequestError
		| PrismaClientRustPanicError
		| PrismaClientInitializationError
		| PrismaClientValidationError
}> {}

type FilterNotContaining<
	Set,
	Needle extends string,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
> = Set extends `${infer _A}${Needle}${infer _B}` ? never : Set

type ExcludeFromUnionOtherTypes<From, E> = From extends E ? From : never

type ExcludeNonStringKeys<Obj> = {
	[k in ExcludeFromUnionOtherTypes<keyof Obj, string>]: k extends string
		? Obj[k]
		: never
}

type ExcludeKeysContaining<
	Obj extends Record<string, any>,
	Key extends string,
> = { [key in FilterNotContaining<keyof Obj, Key>]: Obj[key] }

export type Client = ExcludeKeysContaining<
	ExcludeNonStringKeys<RawPrismaClient>,
	'$' | '_'
> & {}

type LazyPromiseToLazyEffect<Fn extends (...a: any[]) => any> = Fn extends (
	...a: infer Args
) => Promise<infer Result>
	? (...a: Args) => Effect.Effect<Result, PrismaError, never>
	: never

type EffectifyObject<
	Obj extends Record<string, F>,
	F extends (...a: any[]) => any = any,
> = { [op in keyof Obj]: LazyPromiseToLazyEffect<Obj[op]> }

type EffectPrisma = {
	[model in keyof EnhancedPrismaClient]: EffectifyObject<
		EnhancedPrismaClient[model]
	>
}

export function createEffectPrisma(prisma: EnhancedPrismaClient) {
	return new Proxy(
		{},
		{
			getOwnPropertyDescriptor() {
				return { enumerable: true, configurable: true }
			},
			ownKeys() {
				return Object.values(Prisma.ModelName).map(key =>
					key.toLowerCase(),
				)
			},
			get(_target, model) {
				return new Proxy(
					{},
					{
						getOwnPropertyDescriptor() {
							return { enumerable: true, configurable: true }
						},
						ownKeys(): (keyof EnhancedPrismaClient['model'])[] {
							return [
								'aggregate',
								'count',
								'create',
								'createMany',
								'createManyAndReturn',
								'delete',
								'deleteMany',
								'findFirst',
								'findFirstOrThrow',
								'findMany',
								'findUnique',
								'findUniqueOrThrow',
								'groupBy',
								'update',
								'updateMany',
								'updateManyAndReturn',
								'upsert',
							]
						},
						get(_target, method) {
							return (...args: any[]) =>
								Effect.tryPromise(() =>
									(prisma as any)[model][method](...args),
								)
						},
					},
				)
			},
		},
	) as EffectPrisma
}
