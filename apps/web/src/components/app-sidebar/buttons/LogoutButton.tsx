'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth/auth-client'
import { sleep } from '@/lib/utils'
import { Loader2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
	useRef,
	useState,
	type MouseEvent,
	type PropsWithChildren,
} from 'react'

export default function LogoutButton({ children }: PropsWithChildren) {
	const router = useRouter()
	const ref = useRef<HTMLDivElement>(null)
	const [loading, setLoading] = useState(false)

	const logOut = async (e: MouseEvent<HTMLDivElement>) => {
		if (!loading) {
			setLoading(true)
			e.preventDefault()
			authClient.signOut()
			sleep(2000).then(() => {
				router.refresh()
				ref.current?.click()
			})
		}
	}

	return (
		<DropdownMenuItem
			data-loading={loading || undefined}
			onClick={logOut}
			ref={ref}
			className="data-loading:pointer-events-none data-loading:opacity-50"
		>
			{loading ? <Loader2 className="animate-spin" /> : <LogOut />}
			{children}
		</DropdownMenuItem>
	)
}
