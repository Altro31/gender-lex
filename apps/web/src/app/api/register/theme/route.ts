import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest) {
	const { isDark } = await req.json()
	const cookiesStore = await cookies()
	cookiesStore.set("THEME_DARK", isDark + "")
	return NextResponse.json("")
}
