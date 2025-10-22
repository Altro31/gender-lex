"use client"

import { sidebarMenuButtonVariants, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Link } from "@/locales/navigation"
import { Suspense, type ComponentProps } from "react"

export default function NavLink({
	className,
	variant = "sidebar-button",
	...props
}: ComponentProps<typeof Link> & { variant?: "sidebar-button" | "dropdown" }) {
	const { state } = useSidebar()
	return (
		<Suspense>
			<Link
				{...props}
				data-state={state}
				className={cn(
					variant === "sidebar-button" && [
						sidebarMenuButtonVariants({
							variant: "default",
							size: "default",
						}),
						"group-data-[collapsible=icon]:p-0!",
					],
					variant === "dropdown" && [
						"focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
					],
					className,
				)}
			/>
		</Suspense>
	)
}
