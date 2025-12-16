import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function sleep(time: number) {
	return new Promise(res => setTimeout(res, time))
}

export async function tryCatch<T>(promise: Promise<T>) {
	try {
		const res = await promise
		return [null, res] as const
	} catch (e) {
		return [e as Error, null] as const
	}
}
