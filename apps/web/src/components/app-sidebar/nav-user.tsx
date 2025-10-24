import envs from "@/lib/env/env-server" with { type: "macro" }
import { BadgeCheck, ChevronsUpDown, LogIn, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getSession } from "@/lib/auth/auth-server"

import GithubButton from "@/components/app-sidebar/buttons/GithubButton"
import GoogleButton from "@/components/app-sidebar/buttons/GoogleButton"
import LogoutButton from "@/components/app-sidebar/buttons/LogoutButton"
import NavLink from "@/components/app-sidebar/nav-link"
import ThemeSwitcher from "@/components/theme/theme-switcher"
import LanguageSwitcher from "@/locales/components/language-switcher"
import { useLingui } from "@lingui/react/macro"

export default async function NavUser() {
	const session = await getSession()

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				{session && !session.user.isAnonymous ? <User /> : <Login />}
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

async function User() {
	const { t } = useLingui()
	const session = await getSession()
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage
							src={session?.user.image ?? ""}
							alt={session?.user.name}
						/>
						<AvatarFallback className="rounded-lg">
							CN
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">
							{session?.user.name}{" "}
						</span>
						<span className="truncate text-xs">
							{session?.user.email}
						</span>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage
								src={session?.user.image ?? ""}
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
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<BadgeCheck />
						{t`Account`}
					</DropdownMenuItem>
					<ThemeSwitcher />
					<LanguageSwitcher />
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<LogoutButton>{t`Logout`}</LogoutButton>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function Login() {
	const { t } = useLingui()
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="grid size-8 shrink-0 place-content-center">
						<LogIn className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{t`Login`}</span>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<NavLink href="/auth/login" variant="dropdown">
							<UserIcon />
							{t`Email`}
						</NavLink>
					</DropdownMenuItem>
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
