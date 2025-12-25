import { InferUITools, tool, UIDataTypes, UIMessage } from 'ai'
import z from 'zod'

export const authHelpTools = {
	authRedirect: tool({
		description: 'Redirects the user to login or register page',
		inputSchema: z.object({ redirect: z.enum(['login', 'register']) }),
	}),
}

export type AuthHelpTools = InferUITools<typeof authHelpTools>
export type AuthToolsMessage = UIMessage<never, UIDataTypes, AuthHelpTools>
