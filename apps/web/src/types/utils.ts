export type Decrement<N extends number, A extends unknown[] = []> = [
	...A,
	unknown,
]["length"] extends N
	? A["length"]
	: Decrement<N, [...A, unknown]>
