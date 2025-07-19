import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {}

export default function NavUserLogout({ children }: Props) {
	return <button>{children}</button>
}
