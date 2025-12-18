import type { ORMError, ZenStackPromise } from '@zenstackhq/orm'
import { Data, Effect } from 'effect'
import type { UnionToTuple } from 'type-fest'
import type { ClientType } from './client'
import { schema, type SchemaType } from './generated/schema'

export class ClientError extends Data.TaggedError('ClientError')<{
	details: ORMError
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
	ExcludeNonStringKeys<ClientType>,
	'$' | '_'
> & {}

type LazyPromiseToLazyEffect<Fn extends (...a: any[]) => any> = Fn extends (
	...a: infer Args
) => Promise<infer Result>
	? (...a: Args) => Effect.Effect<Result, ClientError, never>
	: never

type EffectifyObject<
	Obj extends Record<string, F>,
	F extends (...a: any[]) => any = any,
> = { [op in keyof Obj]: LazyPromiseToLazyEffect<Obj[op]> }

type EffectClient = {
	[model in keyof ClientType]: EffectifyObject<NonNullable<ClientType[model]>>
}

export function createEffectClient(prisma: ClientType) {
	return new Proxy(
		{},
		{
			getOwnPropertyDescriptor() {
				return { enumerable: true, configurable: true }
			},
			ownKeys() {
				return Object.keys(schema.models).map(key => key.toLowerCase())
			},
			get(_target, model) {
				return new Proxy(
					{},
					{
						getOwnPropertyDescriptor() {
							return { enumerable: true, configurable: true }
						},
						ownKeys(): UnionToTuple<keyof ClientType['model']> {
							return [
								'create',
								'delete',
								'createMany',
								'createManyAndReturn',
								'upsert',
								'findMany',
								'findUnique',
								'findUniqueOrThrow',
								'findFirst',
								'findFirstOrThrow',
								'update',
								'updateMany',
								'updateManyAndReturn',
								'deleteMany',
								'count',
								'aggregate',
								'groupBy',
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
	) as EffectClient
}

export function effectify<T>(func: T) {
	type Eff = T extends ZenStackPromise<SchemaType, infer R> ? R : never
	return Effect.tryPromise(
		() => func as Promise<any>,
	) as unknown as Effect.Effect<Eff, ClientError, never>
}
