import { setServerLocale } from "@/locales/request"
import LoginContainer from "@/sections/auth/login/login-container"

export default async function LoginPage({
	params,
}: PageProps<"/[locale]/auth/login">) {
	await setServerLocale(params)
	return <LoginContainer />
}
