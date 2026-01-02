'use client'

import type { MessageMapper } from '@repo/types/sse'
import {
	createContext,
	use,
	useEffect,
	useState,
	type PropsWithChildren,
} from 'react'
import ReconnectingEventSource from 'reconnecting-eventsource'
import { useSession } from './auth/auth-client'

const EventSourceContext = createContext<EventSource | null>(null)

interface Props extends PropsWithChildren {}

export function EventSourceProvider({ children }: Props) {
	const { data } = useSession()
	const [eventSource, setEventSource] = useState<EventSource | null>(null)
	// oxlint-disable-next-line exhaustive-deps
	useEffect(() => {
		if (!data) return
		const source = new ReconnectingEventSource('/api/sse', {
			withCredentials: true,
		})
		setEventSource(source)
		return () => source.close()
	}, [setEventSource, data])
	return (
		<EventSourceContext value={eventSource}>{children}</EventSourceContext>
	)
}

export const useEventSource = () => use(EventSourceContext)

export function useSse<
	Event extends keyof MessageMapper,
	Data = MessageMapper[Event],
>(event: Event, listener: (data: Data) => void) {
	const eventSource = use(EventSourceContext)

	useEffect(() => {
		const middleware = (e: MessageEvent) => {
			let data
			try {
				data = JSON.parse(e.data)
			} catch {
				data = e.data
			}
			listener(data)
		}

		eventSource?.addEventListener(event, middleware)
		return () => eventSource?.removeEventListener(event, middleware)
		// oxlint-disable-next-line exhaustive-deps
	}, [eventSource])
}
