import { setServerLocale } from "@/locales/request"
import RegisterContainer from "@/sections/auth/register/register-container"

export default async function RegisterPage({
	params,
}: PageProps<"/[locale]/auth/register">) {
	await setServerLocale(params)
	return <RegisterContainer />
}
