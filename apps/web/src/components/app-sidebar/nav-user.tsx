import envs from '@/lib/env/env-server' with { type: 'macro' }
import { BadgeCheck, ChevronsUpDown, LogIn } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getSession } from '@/lib/auth/auth-server'

import GithubButton from '@/components/app-sidebar/buttons/GithubButton'
import GoogleButton from '@/components/app-sidebar/buttons/GoogleButton'
import ThemeSwitcher from '@/components/theme/theme-switcher'
import LanguageSwitcher from '@/locales/components/language-switcher'
import { t } from '@lingui/core/macro'
import Link from 'next/link'
import EmailButton from './buttons/EmailButton'
import { LogoutDropdownMenuItem, SessionDropdownMenu } from './session-dropdown'

export default async function NavUser() {
	const session = await getSession()

	return (
		<SidebarMenu>
			<SidebarMenuItem>{session ? <User /> : <Login />}</SidebarMenuItem>
		</SidebarMenu>
	)
}

async function User() {
	const session = await getSession()
	return (
		<SessionDropdownMenu>
			<DropdownMenuTrigger
				className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				render={<SidebarMenuButton size="lg" />}
			>
				<Avatar className="h-8 w-8 rounded-lg">
					<AvatarImage
						src={session?.user.image ?? undefined}
						alt={session?.user.name}
					/>
					<AvatarFallback className="rounded-lg">CN</AvatarFallback>
				</Avatar>
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-medium">
						{session?.user.name}{' '}
					</span>
					<span className="truncate text-xs">
						{session?.user.email}
					</span>
				</div>
				<ChevronsUpDown className="ml-auto size-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="p-0 font-normal">
						<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={session?.user.image ?? ''}
									alt={session?.user.name}
								/>
								<AvatarFallback className="rounded-lg">
									CN
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{session?.user.name}
								</span>
								<span className="truncate text-xs">
									{session?.user.email}
								</span>
							</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem render={<Link href="/profile" />}>
						<BadgeCheck />
						{t`Account`}
					</DropdownMenuItem>
					<ThemeSwitcher />
					<LanguageSwitcher />
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<LogoutDropdownMenuItem>{t`Logout`}</LogoutDropdownMenuItem>
			</DropdownMenuContent>
		</SessionDropdownMenu>
	)
}

function Login() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				render={<SidebarMenuButton size="lg" />}
			>
				<div className="grid size-8 shrink-0 place-content-center">
					<LogIn />
				</div>
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-medium">{t`Login`}</span>
				</div>
				<ChevronsUpDown className="ml-auto size-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuGroup>
					<EmailButton />
					<DropdownMenuSeparator />
					<GoogleButton redirect={envs.UI_URL} />
					<GithubButton redirect={envs.UI_URL} />
					<DropdownMenuSeparator />
					<ThemeSwitcher />
					<LanguageSwitcher />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
