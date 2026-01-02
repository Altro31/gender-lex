'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuItem } from '../ui/dropdown-menu'

import { authClient } from '@/lib/auth/auth-client'
import { LogOut } from 'lucide-react'
import { useTransition } from 'react'
import Loader from '../loader'

const sessionDropdown = MenuPrimitive.createHandle()

export function SessionDropdownMenu(
	props: Omit<MenuPrimitive.Root.Props, 'handle'>,
) {
	return <DropdownMenu {...props} handle={sessionDropdown} />
}

export function LogoutDropdownMenuItem({
	children,
	disabled,
	...props
}: Omit<MenuPrimitive.Item.Props, 'onClick' | 'closeOnClick'>) {
	const router = useRouter()
	const [pending, startLogoutTransition] = useTransition()

	const logOut = () =>
		startLogoutTransition(async () => {
			await authClient.signOut()
			router.refresh()
			setTimeout(sessionDropdown.close, 1000)
		})

	return (
		<DropdownMenuItem
			{...props}
			closeOnClick={false}
			onClick={logOut}
			disabled={pending || disabled}
		>
			{pending ? <Loader /> : <LogOut />}
			{children}
		</DropdownMenuItem>
	)
}
