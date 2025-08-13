import { auth } from "@/lib/auth/auth-server"
import { NextRequest } from "next/server"

export async function anonymousCheck(req: NextRequest) {
	const session = await auth.api.getSession(req)
	if (!session) {
		const { headers } = await auth.api.signInAnonymous({
			returnHeaders: true,
		})
		const [cookie] = headers.getSetCookie()
		req.cookies.set(cookie!, "")
	}
}
