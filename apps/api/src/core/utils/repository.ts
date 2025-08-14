import type { PrismaClient } from '@repo/db'
import type { Prisma } from '@repo/db/models'

type CamelCase<S extends string> = S extends `${infer P1}${infer P2}`
	? `${Lowercase<P1>}${P2}`
	: Lowercase<S>

type ModelName = CamelCase<Prisma.ModelName>

export abstract class PrismaRepository {
	constructor(
		protected readonly prisma: PrismaClient,
		protected readonly model: ModelName,
	) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this

		return new Proxy(self as any, {
			get(target, prop, receiver) {
				// 1) Prioriza miembros propios de la clase (incluye getters)
				if (Reflect.has(target, prop)) {
					return Reflect.get(target, prop, receiver)
				}

				// 2) Fallback: delega en prismaService
				const base = prisma[model] as any
				const value = base[prop]

				// a) Métodos top‑level de Prisma ($connect, $disconnect, $transaction, $on, etc.)
				if (typeof value === 'function') {
					return value.bind(base)
				}

				// b) Delegados de modelo: prisma.user, prisma.post, ...
				if (value && typeof value === 'object') {
					// Envuelve el delegado de modelo para bindear correctamente sus métodos (findMany, create, etc.)
					return new Proxy(value, {
						get(model, p) {
							const mv = model[p]
							if (typeof mv === 'function') return mv.bind(model)
							return mv
						},
					})
				}

				// c) Propiedades simples (si existieran)
				return value
			},

			has(target, prop) {
				return (
					Reflect.has(target, prop) || prop in (prisma[model] as any)
				)
			},

			getOwnPropertyDescriptor(target, prop) {
				return (
					Reflect.getOwnPropertyDescriptor(target, prop) ??
					Reflect.getOwnPropertyDescriptor(prisma[model] as any, prop)
				)
			},
		})
	}
}
